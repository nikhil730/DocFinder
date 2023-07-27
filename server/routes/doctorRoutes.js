const express = require("express");
const { getDoctorInfoController } = require("../controllers/doctorCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

module.exports = router;
