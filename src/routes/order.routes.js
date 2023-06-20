const express = require("express");
const Router = express.Router();
const path = require("path");
const { body } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validators",
  "order.validator"
));
const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
} = require(path.join(__dirname, "..", "controller", "order.controller"));

Router.get("/", getAllOrders);

Router.post("/", createOrderValidator, createOrder);

Router.get("/:id", getOrderById);

Router.put("/:id", updateOrder);

Router.delete("/:id", deleteOrder);

module.exports = Router;
