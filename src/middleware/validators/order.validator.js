const { param, body } = require("express-validator");

createOrderValidator = [
  body("pickUpyTime")
    .exists()
    .withMessage("PicUpTime is Missing")
    .isDate()
    .withMessage("Wrong PickUp Time Format")
    .custom((value) => {
      return value > Date.now();
    })
    .withMessage("Pickup time must be in the future"),
  body("arrivalTime")
    .exists()
    .withMessage("PicUpTime is Missing")
    .isDate()
    .withMessage("Wrong PickUp Time Format")
    .custom((value, { req }) => {
      return value > Date.now() && value > req.body.pickUpTime;
    })
    .withMessage("Arrival time must be after pickup time and in the future"),
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
  body("store")
    .exists()
    .withMessage("Store is missing")
    .isMongoId()
    .withMessage("Invalid store ID"),
  body("voucher").optional().isMongoId().withMessage("Invalid Voucher"),
];
