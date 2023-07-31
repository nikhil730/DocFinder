const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// get doctor info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

// get doctor by id
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET Appointments
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
