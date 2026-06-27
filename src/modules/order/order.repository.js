const Order = require("./order.model");

const createOrder = async (payload) => {
  return Order.create(payload);
};

const getPendingOrders = async (cafeId) => {
  return Order.find({
    cafeId,
    status: "PENDING",
  }).sort({ statusChangedAt: -1 });
};

const getOrders = async (cafeId, status) => {
  const filter = { cafeId };

  if (status) {
    filter.status = status;
  }

  return Order.find(filter).sort({
    statusChangedAt: -1,
  });
};

const getOrderById = async (orderId, cafeId) => {
  return Order.findOne({
    _id: orderId,
    cafeId,
  });
};

const updateOrder = async (orderId, updateData) => {
  return Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  });
};

const getPublicOrderStatus = async (orderId, trackingToken) => {
  return Order.findOne({
    _id: orderId,
    trackingToken,
  })
    .select(
      "orderNumber tableNumber customerName mobileNumber visitId items subtotal finalAmount status statusChangedAt createdAt updatedAt cafeId"
    )
    .populate("cafeId", "cafeName address phoneNumber");
};

module.exports = {
  createOrder,
  getPendingOrders,
  getOrders,
  getOrderById,
  updateOrder,
  getPublicOrderStatus,
};
