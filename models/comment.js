const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId }, //user : id, avt, ...
    product_id: { type: mongoose.Types.ObjectId }, //id of product
    posted: Date,
    text: String,
    commentlikes: Array,
    comment_like_num: Number,
    parent_slug: String, //
    slug: String, //
    full_slug: String, //
    score: Number, //
  },
  {
    // collection: "comments",
    timestamps: true,
  },
);

//Export the model
module.exports = mongoose.model("Comments", commentSchema);
