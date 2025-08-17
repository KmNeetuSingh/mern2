const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Db Connected Successfully");
  } catch (err) {
    console.log(`${err}`);
  }
};
module.exports = connectDB;
