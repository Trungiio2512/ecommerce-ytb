const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    upperCase: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  expired: {
    type: Date,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
