const Cafe = require("./cafe.model");

const createCafe = async (data) => {
  return Cafe.create(data);
};

const findCafeByEmail = async (email, includePassword = false) => {
  let query = Cafe.findOne({ email });

  if (includePassword) {
    query = query.select("+password");
  }

  return query;
};

const findCafeByPhoneNumber = async (phoneNumber) => {
  return Cafe.findOne({ phoneNumber });
};

const findCafeById = async (id) => {
  return Cafe.findById(id);
};

module.exports = {
  createCafe,
  findCafeByEmail,
  findCafeById,
  findCafeByPhoneNumber,
};
