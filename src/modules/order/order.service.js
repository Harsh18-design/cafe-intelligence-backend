const crypto = require("crypto");

const AppError = require("../../common/utils/app-error.util");

const menuRepository = require("../menu/menu.repository");
const orderRepository = require("./order.repository");
const visitService = require("../visit/visit.service");
const cafeRepository = require("../cafe/cafe.repository");
const { calculateDistanceInMeters } = require("../../common/utils/geo.util");

const { getIO } = require("../../config/socket");

const generateOrderNumber = () => {
  return `ORD-${Date.now()}`;
};

const generateTrackingToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const createOrder = async (cafeId, payload) => {
  const cafe = await cafeRepository.findCafeById(cafeId);

  if (!cafe) {
    throw new AppError("Cafe not found", 404);
  }

  let customerLocation = {
    latitude: null,
    longitude: null,
    distanceFromCafeMeters: null,
  };

  if (cafe.geoFence?.isEnabled) {
    const latitude = Number(payload.latitude);
    const longitude = Number(payload.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new AppError(
        "Location permission is required to place order from this cafe",
        400
      );
    }

    const distance = calculateDistanceInMeters(
      cafe.geoFence.latitude,
      cafe.geoFence.longitude,
      latitude,
      longitude
    );

    if (distance > cafe.geoFence.radiusMeters) {
      throw new AppError(
        // `You are too far from the cafe to place this order. Distance: ${distance} meters`,
        `You are too far from the cafe to place this order.`,
        403
      );
    }

    customerLocation = {
      latitude,
      longitude,
      distanceFromCafeMeters: distance,
    };
  }

  let subtotal = 0;
  const items = [];

  for (const item of payload.items) {
    const menuItem = await menuRepository.findById(cafeId, item.menuItemId);

    if (!menuItem || !menuItem.isActive) {
      throw new AppError("Menu item not found or inactive", 404);
    }

    const quantity = Number(item.quantity);
    const unitPrice = Number(menuItem.price);
    const totalPrice = unitPrice * quantity;

    subtotal += totalPrice;

    items.push({
      menuItemId: menuItem._id,
      itemName: menuItem.itemName,
      quantity,
      unitPrice,
      totalPrice,
      note: item.note || null,
    });
  }

  const order = await orderRepository.createOrder({
    orderNumber: generateOrderNumber(),
    trackingToken: generateTrackingToken(),
    cafeId,
    tableNumber: payload.tableNumber,
    customerName: payload.customerName || null,
    mobileNumber: payload.mobileNumber || null,
    note: payload.note || null,
    items,
    subtotal,
    finalAmount: subtotal,
    customerLocation,
  });

  const io = getIO();
  io.to(`cafe:${cafeId}`).emit("new-order", order);

  return order;
};

const getPendingOrders = async (cafeId) => {
  return orderRepository.getPendingOrders(cafeId);
};

const getOrders = async (cafeId, status) => {
  return orderRepository.getOrders(cafeId, status);
};

const createBillFromOrder = async (cafeId, order) => {
  if (order.visitId) {
    return order.visitId;
  }

  if (!order.mobileNumber) {
    throw new AppError(
      "Mobile number is required to complete order and create bill",
      400
    );
  }

  const result = await visitService.createVisit(cafeId, {
    mobileNumber: order.mobileNumber,
    customerName: order.customerName || "",
    items: order.items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    })),
    discountAmount: 0,
    taxAmount: 0,
    paymentMethod: "UPI",
  });

  await orderRepository.updateOrder(order._id, {
    visitId: result.visit._id,
  });

  return result.visit._id;
};

const updateOrderStatus = async (cafeId, orderId, status) => {
  const order = await orderRepository.getOrderById(orderId, cafeId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status === status) {
    return order;
  }

  let visitId = order.visitId;

  if (status === "COMPLETED") {
    visitId = await createBillFromOrder(cafeId, order);
  }

  const updatedOrder = await orderRepository.updateOrder(orderId, {
    status,
    visitId,
    statusChangedAt: new Date(),
  });

  const io = getIO();

  io.to(`cafe:${cafeId}`).emit("order-status-updated", updatedOrder);
  io.to(`order:${orderId}`).emit("order-status-updated", updatedOrder);

  return updatedOrder;
};

module.exports = {
  createOrder,
  getPendingOrders,
  getOrders,
  updateOrderStatus,
  generateTrackingToken,
};
