const Customer = require("../customer/customer.model");
const Visit = require("../visit/visit.model");

const getCustomerStats = async (cafeId) => {
  const stats = await Customer.aggregate([
    {
      $match: {
        cafeId,
      },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        repeatCustomers: {
          $sum: {
            $cond: [{ $gt: ["$totalVisits", 1] }, 1, 0],
          },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalCustomers: 0,
      repeatCustomers: 0,
    }
  );
};

const getVisitStats = async (cafeId) => {
  const stats = await Visit.aggregate([
    {
      $match: {
        cafeId,
      },
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$finalAmount" },
        averageBillAmount: { $avg: "$finalAmount" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalVisits: 0,
      totalRevenue: 0,
      averageBillAmount: 0,
    }
  );
};

const getTopCustomers = async (cafeId, limit = 5) => {
  return Customer.find({ cafeId })
    .sort({ totalSpent: -1 })
    .limit(limit)
    .select(
      "customerName mobileNumber totalVisits totalSpent averageSpend lastVisitDate tier"
    );
};

const getRevenueTrend = async (cafeId, groupBy = "day") => {
  let dateFormat = "%Y-%m-%d";

  if (groupBy === "month") {
    dateFormat = "%Y-%m";
  }

  if (groupBy === "year") {
    dateFormat = "%Y";
  }

  return Visit.aggregate([
    {
      $match: {
        cafeId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$visitDate",
          },
        },
        revenue: { $sum: "$finalAmount" },
        visits: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        period: "$_id",
        revenue: 1,
        visits: 1,
      },
    },
  ]);
};

const getCustomerGrowth = async (cafeId) => {
  return Customer.aggregate([
    {
      $match: {
        cafeId,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
          },
        },
        customers: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        period: "$_id",
        customers: 1,
      },
    },
  ]);
};

module.exports = {
  getCustomerStats,
  getVisitStats,
  getTopCustomers,
  getRevenueTrend,
  getCustomerGrowth,
};
