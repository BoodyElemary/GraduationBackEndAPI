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

Router.post("/orders", createOrderValidator, createOrder);

Router.get("/orders", getAllOrders);

Router.get("/orders/:id", getOrderById);

Router.put("/orders/:id", updateOrder);

Router.delete("/orders/:id", deleteOrder);

module.exports = Router;
