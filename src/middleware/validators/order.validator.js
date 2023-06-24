const { param, body } = require("express-validator");
const { isISO8601 } = require("validator");
const mongoose = require("mongoose");
const CustomerModel = mongoose.model("Customer");
const VoucherModel = mongoose.model("Voucher");
const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const ONE_HOUR_DAY_SAVING = 60 * 60 * 1000; // 1 hours in milliseconds
const TEN_MINUTES_IN_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

const createOrderValidator = [
  // Validate the required fields in the request body
  body("customer")
    .exists()
    .notEmpty()
    .withMessage("Cannot create order without logging in !!")
    .isMongoId()
    .withMessage("Wrong Customer Data!!")
    .custom(async (value) => {
      const customer = await CustomerModel.findById(value);
      if (!customer) {
        throw new Error("User does not exist!!");
      }
      return true;
    })
    .withMessage("User does not exist!!"),
  body("pickUpTime")
    .exists()
    .notEmpty()
    .withMessage("You have not selected pick up time!!"),
  body("store", "Store is missing").exists().notEmpty(),

  // Validate format and values of pick up time
  body("pickUpTime", "Invalid pickup time format, use YYYY-MM-DD HH:mm").custom(
    (value) => {
      if (!isISO8601(value, { strict: true })) {
        throw new Error();
      }
      const pickUpTime = new Date(value);
      const now = new Date();
      const nowPlusTenMinutes = new Date(
        now.getTime() + TEN_MINUTES_IN_MS + ONE_HOUR_DAY_SAVING
      );
      if (pickUpTime <= nowPlusTenMinutes) {
        console.log(pickUpTime);
        console.log(nowPlusTenMinutes);
        throw new Error("Pickup time must be at least 10 minutes from now.");
      } else if (pickUpTime > now.getTime() + TWELVE_HOURS_IN_MS) {
        throw new Error("Order must be during the same day.");
      }
      return true;
    }
  ),

  // Validate format and values of arrival time
  body("arrivalTime", "Invalid arrival time format, use YYYY-MM-DD HH:mm")
    .optional()
    .custom((value, { req }) => {
      if (!isISO8601(value, { strict: true })) {
        throw new Error();
      }
      const arrivalTime = new Date(value).getTime();
      const pickUpTime = new Date(req.body.pickUpTime).getTime();
      if (arrivalTime > pickUpTime + ONE_HOUR_DAY_SAVING) {
        throw new Error(
          "Arrival time can't be after more an hour than pickup time."
        );
      } else if (pickUpTime - arrivalTime > 20 * 60 * 1000) {
        throw new Error(
          "Arrival time Cannot be more than 20 minutes earlier than pickup time"
        );
      }
      return true;
    }),

  //   Order Validation
  body("orderedProducts.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity of your Drinks must be greater than 0"),

  body("orderedCustomizedProducts.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity of Customized Drinks must be greater than 0"),

  body("orderedCustomizedProducts.*.base")
    .exists()
    .notEmpty()
    .withMessage("Base in customized Drinks is empty."),

  body("orderedCustomizedProducts.*.flavor")
    .exists()
    .notEmpty()
    .withMessage("Flavor in customized Drinks is empty."),

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
        throw new Error("Voucher is invalid");
      }
      return true;
    })
    .withMessage("Voucher is invalid"),
];

module.exports = { createOrderValidator };
