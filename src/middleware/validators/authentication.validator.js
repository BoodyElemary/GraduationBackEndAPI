const { body } = require("express-validator");

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
const loginAdminValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 50 })
    .withMessage("Full name cannot be longer than 50 characters"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  loginValidation,
  loginAdminValidation,
};
