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
      unique: true,
    },
    category: {
      type: String,
      required: true,
      // unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    numberView: {
      type: Number,
      // required: true,
      default: 0,
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
      type: String,
      default: "https://blog.topcv.vn/wp-content/uploads/2020/04/Thumb-TCVDBPV-1-1.png",
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
