const { param, body } = require("express-validator");
const { isISO8601 } = require("validator");
const mongoose = require("mongoose");
const VoucherModel = mongoose.model("Voucher");

const createOrderValidator = [
  // Validate the required fields in the request body
  body("customer", "Cannot create order without logging in !!")
    .exists()
    .notEmpty(),
  body("pickUpTime", "Pickup Time is Missing").exists().notEmpty(),
  body("arrivalTime", "Arrival Time is Missing").exists().notEmpty(),
  body("store", "Store is missing").exists().notEmpty(),

  // Validate that customer is in database
  body("customer").isMongoId().withMessage("Wrong Customer Data!!"),

  // Validate format and values of pick up time
  body("pickUpTime", "Invalid pickup time format, use YYYY-MM-DD HH:mm").custom(
    (value) => {
      if (!isISO8601(value, { strict: true })) {
        throw new Error();
      }
      const pickUpTime = new Date(value).getTime();
      const now = Date.now();
      if (pickUpTime <= now) {
        throw new Error("Pickup time must be in the future");
      }
      return true;
    }
  ),

  // Validate format and values of arrival time
  body(
    "arrivalTime",
    "Invalid arrival time format, use YYYY-MM-DD HH:mm"
  ).custom((value, { req }) => {
    if (!isISO8601(value, { strict: true })) {
      throw new Error();
    }
    const arrivalTime = new Date(value).getTime();
    const pickUpTime = new Date(req.body.pickUpTime).getTime();
    if (arrivalTime >= pickUpTime) {
      throw new Error(
        "Arrival time must be before pickup time and in the future"
      );
    }
    return true;
  }),

  //   Order Validation
  body("orderedProducts")
    .custom((value, { req }) => {
      return value.length || req.body.orderedCustomizedProducts.length
        ? true
        : false;
    })
    .withMessage("You can't make an empty order!!"),
  body("orderedProducts.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("orderedCustomizedProducts.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),
  body("orderedCustomizedProducts.*.toppings.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),

  // Validate the note field with a regular expression pattern
  body("note")
    .optional()
    .matches(/^[\w\s.,!?()-]*$/)
    .withMessage("Note contains invalid characters"),

  // Check for the store in DB
  body("store").isMongoId().withMessage("Invalid store ID"),

  // Check for the voucher in DB
  body("voucher")
    .optional()
    .isMongoId()
    .withMessage("Wrong Voucher")
    .custom(async (value) => {
      const voucher = await VoucherModel.findById(value);
      if (!voucher) {
        return false;
      }
    })
    .withMessage("Voucher is invalid"),
];

module.exports = { createOrderValidator };
