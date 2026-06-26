const cafeRepository = require("../cafe/cafe.repository");

const findUserByEmail = async (email, includePassword = false) => {
  return cafeRepository.findCafeByEmail(email, includePassword);
};

module.exports = {
  findUserByEmail,
};
