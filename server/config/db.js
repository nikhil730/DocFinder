const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        `Connected to Mongodb ${mongoose.connection.host}`.bgGreen.white
      );
    })
    .catch((error) =>
      console.log(`Mongoose server issue ${error}`.bgRed.white)
    );
};
module.exports = connectDB;
