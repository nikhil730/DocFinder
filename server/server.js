const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const { route } = require("./routes/userRoutes");

const app = express();

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//middelwares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("server runing");
});
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`
      .bgWhite.black
  );
});
