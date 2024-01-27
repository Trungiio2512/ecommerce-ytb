const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  mongoose.set("strictQuery", true);
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URL);
    // mongoose.set("strictQuery", false);
    if (conn.connection.readyState === 1) {
      console.log("db connection sucessful");
    } else console.log("db connection is failed");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = dbConnect;
