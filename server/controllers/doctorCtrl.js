const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    console.log("doc info" + doctor);
    res.status(200).send({
      success: true,
      message: `doctor Data fetch successful`,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in geting doctor info`,
      error,
    });
  }
};

module.exports = {
  getDoctorInfoController,
};
