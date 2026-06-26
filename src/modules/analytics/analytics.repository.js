const Visit = require("../visit/visit.model");

const getTopSellingItems = async (cafeId) => {
  return Visit.aggregate([
    {
      $match: {
        cafeId,
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.menuItemId",

        itemName: {
          $first: "$items.itemName",
        },

        quantity: {
          $sum: "$items.quantity",
        },

        revenue: {
          $sum: "$items.totalPrice",
        },

        orders: {
          $sum: 1,
        },

        averageSellingPrice: {
          $avg: "$items.unitPrice",
        },
      },
    },

    {
      $sort: {
        quantity: -1,
      },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        _id: 0,
        itemName: 1,
        quantity: 1,
        revenue: 1,
        orders: 1,

        averageSellingPrice: {
          $round: ["$averageSellingPrice", 2],
        },
      },
    },
  ]);
};

module.exports = {
  getTopSellingItems,
};
