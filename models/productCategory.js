const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productCategory = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      filename: String,
    },
    brands: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
      },
    ],
  },
  { timestamps: true },
);

//Export the model
module.exports = mongoose.model("Category", productCategory);
