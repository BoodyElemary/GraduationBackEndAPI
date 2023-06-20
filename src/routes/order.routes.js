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
  updateOrder,
  deleteOrder,
  getAllOrders,
} = require(path.join(__dirname, "..", "controller", "order.controller"));

Router.get("/", getAllOrders);

Router.route("/").post(createOrderValidator, validationResult, createOrder);

Router.get("/:id", getOrderById);

Router.put("/:id", updateOrder);

Router.delete("/:id", deleteOrder);

module.exports = Router;
