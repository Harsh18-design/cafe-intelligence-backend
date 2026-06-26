const express = require("express");

const authMiddleware = require("../../common/middlewares/auth.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const visitController = require("./visit.controller");
const { createVisitSchema } = require("./visit.validation");

const router = express.Router();

router.get("/recent", authMiddleware, visitController.getRecentVisits);

router.get("/:visitId", authMiddleware, visitController.getVisitDetails);

router.post(
  "/",
  authMiddleware,
  validate(createVisitSchema),
  visitController.createVisit
);

module.exports = router;
