const express = require("express");
const Router = express.Router();
const path = require("path");
const { createOrderValidator } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validators",
  "order.validator"
));
const validationResult = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const {
  createOrder,
  getOrderById,
  updateOrderAsCustomer,
  updateOrderAsAdmin,
  deleteOrderByAdmin,
  getAllOrders,
  confirmedOrder,
} = require(path.join(__dirname, "..", "controller", "order.controller"));
const endpointSecret =
  "whsec_2908c30ff34b061a57104853f5123ad0fad4d4afe0eb15828b5dc41a26ff251c";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

Router.get("/", getAllOrders);

Router.route("/").post(createOrderValidator, validationResult, createOrder);

Router.route("/webhook").post(confirmedOrder);

Router.get("/:id", getOrderById);

Router.put("/order_edit/:id", updateOrderAsCustomer);

Router.put("/order_admin_edit/:id", updateOrderAsAdmin);

Router.delete("/:id", deleteOrderByAdmin);



module.exports = Router;
