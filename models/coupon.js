const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    maxPriceDiscount: {
      type: Number,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      filename: { type: String, default: "" },
      url: {
        type: String,
        default: "https://cf.shopee.vn/file/sg-11134004-22120-4cskiffs0olvc3",
      },
    },
    type: {
      type: String,
      default: "freeship",
      enum: ["freeship", "freeprice"],
    },
    description: {
      type: String,
      default: "",
    },
    expired: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
