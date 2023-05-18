const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
      // index: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    specifications: {
      type: Array,
      required: true,
      default: [],
      // unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    warranty: {
      type: String,
      default: "",
    },
    rams: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Ram",
      },
    ],
    internals: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Internal",
      },
    ],
    colors: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Color",
      },
    ],
    delivery: {
      type: String,
      default: "",
    },
    payment: {
      type: String,
      default: "",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: true,
    },
    priceSale: {
      type: Number,
    },
    priceSaleExpired: {
      type: Date,
    },
    features: {
      type: Boolean,
      default: false,
    },
    news: {
      type: Boolean,
      default: false,
    },
    deal: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Category",
    },
    quantity: {
      type: Number,
      // required: true,
      default: 0,
    },
    sold: {
      type: Number,
      // required: ,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    thumb: {
      type: String,
      default: "",
    },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
