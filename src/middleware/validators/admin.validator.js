const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const Store = mongoose.model('Store')
const Admin = mongoose.model("Admin");

const newAdminValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 50 })
    .withMessage("Full name cannot be longer than 50 characters")
    .custom(async (value) => {
      const admin = await Admin.findOne({ fullName: value });
      if (admin) {
        return Promise.reject("fullName already in use");
      }
    }),
  body("password")
    .isStrongPassword({
      minLength: 0,
    })
    .withMessage(
      "Weak password!!Password should be combination of one uppercase , one lower case, one special char and one digit."
    )
    .isLength({ max: 35, min: 8 })
    .withMessage("password must be between 8 to 35 char long."),
  body("store")
    .notEmpty()
    .withMessage("Store ID is required")
    .isMongoId()
    .withMessage("Invalid store ID")
    .custom(async (value) => {
      const store = await Store.findById(value);
      if (!store) {
        return Promise.reject("Store not found");
      }
    }),
];
const updateAdminValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Full name cannot be longer than 50 characters")
    .custom(async (value, { req }) => {
      const admin = await Admin.findOne({ fullName: value });
      if (admin && admin.id !== req.params.id) {
        return Promise.reject("fullName already in use");
      }
    }),
  body("password")
    .optional()
    .isStrongPassword({
      minLength: 0,
    })
    .withMessage(
      "Weak password!!Password should be combination of one uppercase , one lower case, one special char and one digit."
    )
    .isLength({ max: 35, min: 8 })
    .withMessage("password must be between 8 to 35 char long."),
  body("store")
    .optional()
    .isMongoId()
    .withMessage("Invalid store ID")
    .custom(async (value) => {
      const store = await Store.findById(value);
      if (!store) {
        return Promise.reject("Store not found");
      }
    }),
];
const paramIdValidation = param("id").isMongoId().withMessage("Not valid id");
const storeIdValidation = param("store")
  .isMongoId()
  .withMessage("Not valid id");

module.exports = {
  newAdminValidation,
  updateAdminValidation,
  paramIdValidation,
  storeIdValidation,
};
