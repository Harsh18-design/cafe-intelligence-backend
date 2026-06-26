const express = require("express");

const authMiddleware = require("../../common/middlewares/auth.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const menuController = require("./menu.controller");

const {
  createMenuItemSchema,
  updateMenuItemSchema,
} = require("./menu.validation");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createMenuItemSchema),
  menuController.createMenuItem
);

router.get("/", authMiddleware, menuController.getMenuItems);

router.get("/active", authMiddleware, menuController.getActiveMenuItems);

router.put(
  "/:itemId",
  authMiddleware,
  validate(updateMenuItemSchema),
  menuController.updateMenuItem
);

router.delete("/:itemId", authMiddleware, menuController.deleteMenuItem);

module.exports = router;
