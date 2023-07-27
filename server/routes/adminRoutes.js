const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//get all users
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//get all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//post account(doctor) status
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
