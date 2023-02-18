const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URL);

    if (conn.connection.readyState === 1) {
      console.log("db connection successful");
    } else console.log("db connection is failed");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = dbConnect;
