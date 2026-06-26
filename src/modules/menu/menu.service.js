const AppError = require("../../common/utils/app-error.util");
const menuRepository = require("./menu.repository");

const createMenuItem = async (cafeId, payload) => {
  return menuRepository.createMenuItem({
    cafeId,
    itemCode: payload.itemCode || null,
    itemName: payload.itemName,
    category: payload.category || "GENERAL",
    price: payload.price,
    // costPrice: payload.costPrice || 0,
    costPrice: payload.costPrice ?? null,
    isActive: payload.isActive ?? true,
    description: payload.description || null,
  });
};

const getMenuItems = async (cafeId) => {
  return menuRepository.getMenuItems(cafeId);
};

const getActiveMenuItems = async (cafeId) => {
  return menuRepository.getActiveMenuItems(cafeId);
};

const updateMenuItem = async (cafeId, itemId, payload) => {
  const item = await menuRepository.updateMenuItem(cafeId, itemId, payload);

  if (!item) {
    throw new AppError("Menu item not found", 404);
  }

  return item;
};

const deleteMenuItem = async (cafeId, itemId) => {
  const item = await menuRepository.deleteMenuItem(cafeId, itemId);

  if (!item) {
    throw new AppError("Menu item not found", 404);
  }

  return item;
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getActiveMenuItems,
  updateMenuItem,
  deleteMenuItem,
};
