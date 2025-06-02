const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "prBlog",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("prUser", userSchema);
