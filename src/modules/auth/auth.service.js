const bcrypt = require("bcryptjs");

const AppError = require("../../common/utils/app-error.util");
const { generateToken } = require("../../common/helpers/token.helper");

const cafeRepository = require("../cafe/cafe.repository");
const authRepository = require("./auth.repository");
const invoiceRepository = require("../invoice/invoice.repository");

const generateCafeCode = (cafeName) => {
  const cleanName = cafeName.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const prefix = cleanName.substring(0, 3) || "CAF";

  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}${timestamp}`;
};

const registerCafe = async (payload) => {
  const existingCafe = await cafeRepository.findCafeByEmail(payload.email);

  if (existingCafe) {
    throw new AppError("Cafe already registered with this email", 409);
  }

  const existingPhone = await cafeRepository.findCafeByPhoneNumber(
    payload.phoneNumber
  );

  if (existingPhone) {
    throw new AppError("Cafe already registered with this mobile number", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const cafe = await cafeRepository.createCafe({
    cafeCode: generateCafeCode(payload.cafeName),
    cafeName: payload.cafeName,
    ownerName: payload.ownerName,
    email: payload.email,
    password: hashedPassword,
    phoneNumber: payload.phoneNumber,
    address: payload.address,
    gstNumber: payload.gstNumber || null,
  });

  await invoiceRepository.createInvoiceCounter(cafe._id);

  const token = generateToken({
    cafeId: cafe._id,
    email: cafe.email,
    role: "OWNER",
  });

  return {
    token,
    cafe: {
      id: cafe._id,
      cafeCode: cafe.cafeCode,
      cafeName: cafe.cafeName,
      ownerName: cafe.ownerName,
      email: cafe.email,
      phoneNumber: cafe.phoneNumber,
      subscriptionPlan: cafe.subscriptionPlan,
    },
  };
};

const loginCafe = async (payload) => {
  const cafe = await authRepository.findUserByEmail(payload.email, true);

  if (!cafe) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!cafe.isActive) {
    throw new AppError("Cafe account is inactive", 403);
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    cafe.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    cafeId: cafe._id,
    email: cafe.email,
    role: "OWNER",
  });

  return {
    token,
    cafe: {
      id: cafe._id,
      cafeCode: cafe.cafeCode,
      cafeName: cafe.cafeName,
      ownerName: cafe.ownerName,
      email: cafe.email,
      phoneNumber: cafe.phoneNumber,
      subscriptionPlan: cafe.subscriptionPlan,
    },
  };
};

const getProfile = async (user) => {
  const cafe = await cafeRepository.findCafeById(user.cafeId);

  if (!cafe) {
    throw new AppError("Cafe profile not found", 404);
  }

  return {
    id: cafe._id,
    cafeCode: cafe.cafeCode,
    cafeName: cafe.cafeName,
    ownerName: cafe.ownerName,
    email: cafe.email,
    phoneNumber: cafe.phoneNumber,
    address: cafe.address,
    gstNumber: cafe.gstNumber,
    subscriptionPlan: cafe.subscriptionPlan,
    isActive: cafe.isActive,
  };
};
module.exports = {
  registerCafe,
  loginCafe,
  getProfile,
};
