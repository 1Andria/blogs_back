const express = require("express");
const app = express();
app.use(express.json());
const connectToDb = require("./db/connectToDb");
connectToDb();
const cors = require("cors");
const userRouter = require("./users/user.router");
const blogRouter = require("./blogs/blog.router");
const authRouter = require("./auth/auth.router");
app.use(cors());

app.use("/project/users", userRouter);
app.use("/project/blogs", blogRouter);
app.use("/project/auth", authRouter);

app.listen(4005, () => {
  console.log("server running on http://localhost:4005");
});
