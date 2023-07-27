const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
};
