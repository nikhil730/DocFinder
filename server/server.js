const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { route } = require("./routes/userRoutes");

const app = express();

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//middelwares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/user", require("./routes/userRoutes"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`
      .bgWhite.black
  );
});
