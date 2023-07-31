const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: `User Already Exist`, success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({ message: `Registred Succesfully`, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Register Controller ${error.message}`,
    });
  }
};

//login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: `User Not Found`, success: false });
    }
    const passMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passMatch) {
      return res
        .status(200)
        .send({ message: `Invalid Email or Password`, success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Login Controller ${error.message}`,
    });
  }
};

//auth callback
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: `User Not Found`, success: false });
    } else {
      console.log(user);
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Auth Error ${error.message}`,
    });
  }
};

//apply doctor ctrl
const applyDoctorController = async (req, res) => {
  try {
    const newDoc = new doctorModel({ ...req.body, status: "pending" });
    await newDoc.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoc.firstName} ${newDoc.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoc._id,
        name: newDoc.firstName + " " + newDoc.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      data: newDoc,
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error While Applying For Doctor`,
    });
  }
};

//get all noti callback
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    let seennotification = user.seennotification;
    let notification = user.notification;
    //console.log(notification);
    let seenorder = [];
    notification.forEach((noti) => {
      seenorder.push(noti);
    });
    seennotification.forEach((noti) => {
      seenorder.push(noti);
    });
    seennotification = seenorder;
    //seennotification.push({ ...notification });
    console.log("seen notis.");
    console.log(seennotification);
    user.notification = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All Notifications are marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in getting Notifications`,
      error,
    });
  }
};

//delete all noti callback
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    const seennotification = user.seennotification;
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All Read Notifications are deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in deleting Notifications`,
      error,
    });
  }
};

//get all doctors callback
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: `Doctors list fetched Successfully `,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in getting doctors`,
      error,
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    console.log(req.body.date);
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    console.log(date);
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(0.5, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      .add(0.5, "hours")
      .toISOString();
    const doctorId = req.body.doctorId;
    console.log(fromTime);
    console.log(toTime);
    const appointments = await appointmentModel.find({
      doctorId: doctorId,
      date: date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      console.log(appointments);
      console.log("appointment date in db " + appointments[0].date);
    }
    console.log("appointment date from form " + date);
    if (appointments && appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        available: false,
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        available: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const bookeAppointmnetController = async (req, res) => {
  try {
    //console.log(req.body.time);
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A New Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in booking appointment`,
      error,
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
      doctors: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
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
};
