const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookingAvailabilityController,
  bookeAppointmnetController,
  userAppointmentsController,
  addMedicineController,
  getMedicineController,
  removeMedicineController,
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

//Delete all noti api
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//get all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//booking availbility
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

//Add Medicine
router.post("/addMedicine", authMiddleware, addMedicineController);

//Add Medicine
router.post("/removeMedicine", authMiddleware, removeMedicineController);

//Get Medicine
router.post("/getMedicine", authMiddleware, getMedicineController);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
