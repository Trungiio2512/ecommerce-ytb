const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    subdes: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },

    // isLiked: {
    //   type: Boolean,
    //   default: false,
    // },
    // isDisliked: {
    //   type: Boolean,
    //   default: false,
    // },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      filename: String,
      url: String,
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
