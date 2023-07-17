const express = require("express");
const {
  loginController,
  registerController,
} = require("../controllers/userCtrl");

//router object
const router = express.Router();

//routes
//login
router.post("/login", loginController);

//register
router.post("/register", registerController);

module.exports = router;
