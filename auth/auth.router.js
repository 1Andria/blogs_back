const { Router } = require("express");
const validateMiddleware = require("../middlewares/validate.middleware");
const userSchema = require("../validations/user.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config();

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validateMiddleware(userSchema),
  async (req, res) => {
    const { fullName, email, password } = req.body;
    const existUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({ fullName, email, password: hashedPassword });
    res.status(201).json({ message: "user created successfully" });
  }
);

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "fileds are required" });

  const existUser = await userModel
    .findOne({ email: email.toLowerCase() })
    .select("password");
  if (!existUser) {
    return res.status(400).json({ error: "email or password is incorrect" });
  }

  const isPassEqual = await bcrypt.compare(password, existUser.password);

  if (!isPassEqual) {
    return res.status(400).json({ error: "email or password is incorrect" });
  }

  const payLoad = {
    userId: existUser._id,
  };
  const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ accessToken });
});

module.exports = authRouter;
