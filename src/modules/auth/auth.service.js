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

const buildGeoFence = (payload) => {
  const latitude =
    payload.latitude !== undefined && payload.latitude !== null
      ? Number(payload.latitude)
      : null;

  const longitude =
    payload.longitude !== undefined && payload.longitude !== null
      ? Number(payload.longitude)
      : null;

  const radiusMeters = Number(payload.radiusMeters || 200);

  if (latitude !== null && Number.isNaN(latitude)) {
    throw new AppError("Invalid latitude", 400);
  }

  if (longitude !== null && Number.isNaN(longitude)) {
    throw new AppError("Invalid longitude", 400);
  }

  if (radiusMeters < 50 || radiusMeters > 1000) {
    throw new AppError("Radius must be between 50 and 1000 meters", 400);
  }

  if (latitude !== null && longitude !== null) {
    return {
      isEnabled: true,
      latitude,
      longitude,
      radiusMeters,
    };
  }

  return {
    isEnabled: false,
    latitude: null,
    longitude: null,
    radiusMeters: 200,
  };
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
  const geoFence = buildGeoFence(payload);

  const cafe = await cafeRepository.createCafe({
    cafeCode: generateCafeCode(payload.cafeName),
    cafeName: payload.cafeName,
    ownerName: payload.ownerName,
    email: payload.email,
    password: hashedPassword,
    phoneNumber: payload.phoneNumber,
    address: payload.address,
    gstNumber: payload.gstNumber || null,
    geoFence,
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
      geoFence: cafe.geoFence,
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
      geoFence: cafe.geoFence,
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
    geoFence: cafe.geoFence,
  };
};

const updateGeoFence = async (user, payload) => {
  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);
  const radiusMeters = Number(payload.radiusMeters || 200);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new AppError("Latitude and longitude are required", 400);
  }

  if (radiusMeters < 50 || radiusMeters > 1000) {
    throw new AppError("Radius must be between 50 and 1000 meters", 400);
  }

  const cafe = await cafeRepository.updateCafeGeoFence(user.cafeId, {
    isEnabled: payload.isEnabled ?? true,
    latitude,
    longitude,
    radiusMeters,
  });

  if (!cafe) {
    throw new AppError("Cafe profile not found", 404);
  }

  return cafe.geoFence;
};

module.exports = {
  registerCafe,
  loginCafe,
  getProfile,
  updateGeoFence,
};
