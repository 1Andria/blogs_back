const { Router } = require("express");
const userModel = require("../models/user.model");
const { isValidObjectId } = require("mongoose");
const isAuth = require("../middlewares/isAuth");
const blogModel = require("../models/blog.model");

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await userModel
    .find()
    .populate("blogs", "content title description");
  res.json(users);
});

userRouter.delete("/:id", isAuth, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Wrong ID is provided" });
  }

  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.userId !== id) {
    return res.status(400).json({ error: "Not your account" });
  }
  const deletedUser = await userModel.findByIdAndDelete(id);
  await blogModel.deleteMany({ author: id });

  res.json({ message: "user deleted successfully", data: deletedUser });
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Wrong ID is provided" });
  }
  const user = await userModel.findById(id).populate("blogs");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

module.exports = userRouter;
