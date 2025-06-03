const { Router } = require("express");
const blogModel = require("../models/blog.model");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/user.model");
const isAuth = require("../middlewares/isAuth");

const blogRouter = Router();

blogRouter.get("/", async (req, res) => {
  const blogs = await blogModel.find().populate("author", "fullName email");
  res.json(blogs);
});

blogRouter.post("/", isAuth, async (req, res) => {
  const { title, content, description } = req.body;
  if (!title || !content || !description) {
    return res.status(400).json({ error: "required field" });
  }
  const blog = await blogModel.create({
    title,
    content,
    description,
    author: req.userId,
  });
  await userModel.findByIdAndUpdate(req.userId, {
    $push: { blogs: blog._id },
  });

  res.status(201).json({ message: "Created successfully" });
});

blogRouter.delete("/:id", isAuth, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Wrong ID is provided" });
  }

  const blog = await blogModel.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  if (req.userId !== blog.author._id.toString()) {
    return res.status(400).json({ error: "Not your blog buddy" });
  }

  const deletedBlog = await blogModel.findByIdAndDelete(id);
  await userModel.findByIdAndUpdate(blog.author._id, {
    $pull: { blogs: id },
  });
  res.json({ message: "Blog deleted successfully", data: deletedBlog });
});

blogRouter.put("/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Wrong ID is provided" });
  }
  const { title, content, description } = req.body;
  const blog = await blogModel.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  if (req.userId !== blog.author._id.toString()) {
    return res.status(400).json({ error: "Not your blog" });
  }
  const deletedBlog = await blogModel.findByIdAndUpdate(
    id,
    {
      title,
      content,
      description,
      $inc: { __v: 1 },
    },
    { new: true }
  );
  res.json({ message: "Blog updated successfully", data: deletedBlog });
});

blogRouter.get("/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Wrong ID is provided" });
  }
  const blog = await blogModel.findById(id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  res.json(blog);
});

module.exports = blogRouter;
