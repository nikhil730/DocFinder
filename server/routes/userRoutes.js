const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes
//login
router.post("/login", loginController);

//register
router.post("/register", registerController);

//Auth api
router.post("/getUserData", authMiddleware, authController);

//Apply doc api
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Get all noti api
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

module.exports = router;
