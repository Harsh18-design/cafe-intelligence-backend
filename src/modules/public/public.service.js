const AppError = require("../../common/utils/app-error.util");

const cafeRepository = require("../cafe/cafe.repository");
const menuRepository = require("../menu/menu.repository");
const orderService = require("../order/order.service");
const orderRepository = require("../order/order.repository");
const feedbackRepository = require("../feedback/feedback.repository");

const getPublicMenu = async (cafeId) => {
  const cafe = await cafeRepository.findCafeById(cafeId);

  if (!cafe || !cafe.isActive) {
    throw new AppError("Cafe not found", 404);
  }

  const menuItems = await menuRepository.getActiveMenuItems(cafeId);

  return {
    cafe: {
      _id: cafe._id,
      cafeName: cafe.cafeName,
      address: cafe.address,
    },
    menuItems,
  };
};

const createPublicOrder = async (payload) => {
  const cafe = await cafeRepository.findCafeById(payload.cafeId);

  if (!cafe || !cafe.isActive) {
    throw new AppError("Cafe not found", 404);
  }

  return orderService.createOrder(payload.cafeId, payload);
};

const getOrderStatus = async (orderId, trackingToken) => {
  if (!trackingToken) {
    throw new AppError("Tracking token is required", 400);
  }

  const order = await orderRepository.getPublicOrderStatus(
    orderId,
    trackingToken
  );

  if (!order) {
    throw new AppError("Invalid tracking link", 403);
  }

  const feedbackExists = await feedbackRepository.existsByOrderId(order._id);

  const orderObj = order.toObject();

  return {
    ...orderObj,
    feedbackSubmitted: !!feedbackExists,
  };
};

module.exports = {
  getPublicMenu,
  createPublicOrder,
  getOrderStatus,
};
