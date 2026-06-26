const MenuItem = require("./menu-item.model");

const createMenuItem = async (data) => {
  return MenuItem.create(data);
};

const getMenuItems = async (cafeId) => {
  return MenuItem.find({ cafeId }).sort({ createdAt: -1 });
};

const getActiveMenuItems = async (cafeId) => {
  return MenuItem.find({
    cafeId,
    isActive: true,
  }).sort({ itemName: 1 });
};

const findById = async (cafeId, itemId) => {
  return MenuItem.findOne({
    _id: itemId,
    cafeId,
  });
};

const updateMenuItem = async (cafeId, itemId, data) => {
  return MenuItem.findOneAndUpdate(
    {
      _id: itemId,
      cafeId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteMenuItem = async (cafeId, itemId) => {
  return MenuItem.findOneAndUpdate(
    {
      _id: itemId,
      cafeId,
    },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getActiveMenuItems,
  findById,
  updateMenuItem,
  deleteMenuItem,
};
