const express = require("express");

const authController = require("./auth.controller");
const validate = require("../../common/middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("./auth.validation");
const authMiddleware = require("../../common/middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
