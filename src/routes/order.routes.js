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
} = require(path.join(__dirname, "..", "controller", "order.controller"));

Router.get("/", getAllOrders);

Router.route("/").post(createOrderValidator, validationResult, createOrder);

Router.get("/:id", getOrderById);

Router.put("/order_edit/:id", updateOrderAsCustomer);

Router.put("/order_admin_edit/:id", updateOrderAsAdmin);

Router.delete("/:id", deleteOrderByAdmin);

module.exports = Router;
