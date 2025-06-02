const Joi = require("joi");

const userSchema = Joi.object({
  fullName: Joi.string().min(4).max(20).required().messages({
    "string.base": "მხოლოდ სტრინგი",
    "string.min": "სახელისთვის მინიმუმია 4 სიმბოლო",
    "string.max": "სახელისთვის მაქსიმუმია 20 სიმბოლო",
    "any.required": "სახელი აუცილებელია",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "მეილი არასწორია",
    "string.empty": "მეილის ველი ცარიელია",
    "any.required": "მეილი აუცილებელია",
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "პაროლი უნდა შეიცავდეს დიდ და პატარა ასოებს, ციფრს და მინიმუმ 8 სიმბოლოს",
      "string.empty": "პაროლი სავალდებულოა",
      "any.required": "პაროლი აუცილებელია",
    }),
});

module.exports = userSchema;
