const AppError = require("../../common/utils/app-error.util");

const customerRepository = require("../customer/customer.repository");
const visitRepository = require("./visit.repository");
const invoiceService = require("../invoice/invoice.service");
const menuRepository = require("../menu/menu.repository");

const buildCustomerProfileUpdate = (payload) => {
  const updateData = {};

  if (payload.customerName && payload.customerName.trim()) {
    updateData.customerName = payload.customerName.trim();
  }

  if (payload.email && payload.email.trim()) {
    updateData.email = payload.email.trim().toLowerCase();
  }

  if (payload.birthday) {
    updateData.birthday = payload.birthday;
  }

  if (payload.gender) {
    updateData.gender = payload.gender;
  }

  return updateData;
};

const calculateTier = (totalVisits, totalSpent) => {
  if (totalSpent >= 10000 || totalVisits >= 20) {
    return "VIP";
  }

  if (totalVisits >= 5) {
    return "REGULAR";
  }

  return "NEW";
};

const buildBillingItems = async (cafeId, items) => {
  let subtotal = 0;
  const billingItems = [];

  for (const item of items) {
    const menuItem = await menuRepository.findById(cafeId, item.menuItemId);

    if (!menuItem || !menuItem.isActive) {
      throw new AppError(
        `Menu item not found or inactive: ${item.menuItemId}`,
        404
      );
    }

    const quantity = Number(item.quantity);
    const unitPrice = Number(menuItem.price);
    const totalPrice = unitPrice * quantity;

    subtotal += totalPrice;

    billingItems.push({
      menuItemId: menuItem._id,
      itemName: menuItem.itemName,
      quantity,
      unitPrice,
      totalPrice,
    });
  }

  return {
    subtotal,
    billingItems,
  };
};

const createOrUpdateCustomer = async (cafeId, payload, finalAmount, now) => {
  let customer = await customerRepository.findByMobile(
    cafeId,
    payload.mobileNumber
  );

  if (!customer) {
    customer = await customerRepository.createCustomer({
      cafeId,
      mobileNumber: payload.mobileNumber,

      customerName: payload.customerName || null,
      email: payload.email || null,
      birthday: payload.birthday || null,
      gender: payload.gender || null,

      totalVisits: 1,
      totalSpent: finalAmount,
      averageSpend: finalAmount,
      lifetimeValue: finalAmount,

      firstVisitDate: now,
      lastVisitDate: now,

      points: 0,
      tier: calculateTier(1, finalAmount),
      isLostCustomer: false,
    });

    return customer;
  }

  const newTotalVisits = customer.totalVisits + 1;
  const newTotalSpent = customer.totalSpent + finalAmount;
  const newAverageSpend = newTotalSpent / newTotalVisits;

  const profileUpdate = buildCustomerProfileUpdate(payload);

  const updateData = {
    totalVisits: newTotalVisits,
    totalSpent: newTotalSpent,
    averageSpend: Number(newAverageSpend.toFixed(2)),
    lifetimeValue: newTotalSpent,
    lastVisitDate: now,
    isLostCustomer: false,
    tier: calculateTier(newTotalVisits, newTotalSpent),
    ...profileUpdate,
  };

  customer = await customerRepository.updateCustomerById(
    customer._id,
    updateData
  );

  return customer;
};

const createVisit = async (cafeId, payload) => {
  const now = new Date();

  const { subtotal, billingItems } = await buildBillingItems(
    cafeId,
    payload.items
  );

  const discountAmount = Number(payload.discountAmount || 0);
  const taxAmount = Number(payload.taxAmount || 0);

  const finalAmount = subtotal + taxAmount - discountAmount;

  if (finalAmount < 0) {
    throw new AppError("Final amount cannot be negative", 400);
  }

  const customer = await createOrUpdateCustomer(
    cafeId,
    payload,
    finalAmount,
    now
  );

  const invoiceNumber = await invoiceService.generateInvoiceNumber(cafeId);

  const visit = await visitRepository.createVisit({
    invoiceNumber,
    cafeId,
    customerId: customer._id,

    billAmount: finalAmount,

    subtotal,
    discountAmount,
    taxAmount,
    finalAmount,

    paymentMethod: payload.paymentMethod || "UPI",
    pointsEarned: 0,
    visitDate: now,

    items: billingItems,

    createdBy: cafeId,
  });

  return {
    customer,
    visit,
  };
};

const getRecentVisits = async (cafeId) => {
  return visitRepository.getRecentVisits(cafeId, 20);
};

const getVisitDetails = async (cafeId, visitId) => {
  const visit = await visitRepository.getVisitById(cafeId, visitId);

  if (!visit) {
    throw new AppError("Bill not found", 404);
  }

  return visit;
};

module.exports = {
  createVisit,
  getRecentVisits,
  getVisitDetails,
};
