const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const create = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing value");
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for blog ");
  req.body.slug = slugify(title);
  console.log(req.file);
  if (req.file) req.body.image = req.file.path;
  const newBlog = await Blog.create(req.body);
  return res.status(200).json({
    sucess: newBlog ? true : false,
    msg: newBlog ? "Create blog  sucessfully" : "Cannot create blog ",
    data: newBlog,
  });
});
const getAll = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({ sucess: response ? true : false, data: response });
});
const update = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing value for blog ");
  req.body.slug = slugify(req.body.title);
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Update blog sucessfully" : "Cannot update blog",
    data: response,
  });
});
const deleted = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Blog.findByIdAndDelete(bid);
  return res.status(200).json({
    sucess: response ? true : false,
    msg: response ? "Delete blog sucessfully" : "Cannot Delete blog",
    // data: response,
  });
});

const like = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing value");
  const blog = await Blog.findById(bid);
  const hasDisliked = blog?.dislikes.find((ele) => ele.toString() === id);
  if (hasDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: id },
        $push: { likes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  }
  const hasLike = blog?.likes.find((ele) => ele.toString() === id);
  if (hasLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { likes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  }
});
const dislike = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing value");
  const blog = await Blog.findById(bid);
  const hasLike = blog?.likes.find((ele) => ele.toString() === id);
  if (hasLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: id },
        $push: { dislikes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  }
  const hasDisliked = blog?.dislikes.find((ele) => ele.toString() === id);
  if (hasDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      {
        $push: { dislikes: id },
      },
      { new: true },
    );
    return res.json({ sucess: response ? true : false, data: response });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberView: 1 } }, { new: true })
    .populate("likes", "_id firstName lastName")
    .populate("dislikes", "_id firstName lastName");
  return res.status(200).json({ sucess: blog ? true : false, data: blog });
});
module.exports = {
  create,
  update,
  getAll,
  deleted,
  like,
  dislike,
  getBlog,
};
