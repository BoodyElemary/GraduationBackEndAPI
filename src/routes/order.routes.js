const express = require('express');
const Router = express.Router();
const path = require('path');
const { createOrderValidator } = require(path.join(
  __dirname,
  '..',
  'middleware',
  'validators',
  'order.validator',
));
const validationResult = require(path.join(
  __dirname,
  '..',
  'middleware',
  'validation.mw',
));
const {
  createOrder,
  getOrderById,
  updateOrderAsCustomer,
  updateOrderAsAdmin,
  deleteOrderByAdmin,
  getAllOrders,
  confirmedOrder,
   getStoreOrders,
  getStoreOrdersById,
  updateOrderStatus,
} = require(path.join(__dirname, "..", "controller", "order.controller"));

const endpointSecret =
  "whsec_2908c30ff34b061a57104853f5123ad0fad4d4afe0eb15828b5dc41a26ff251c";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

Router.get('/', getAllOrders);

Router.get('/sotresOrders', getStoreOrders);

Router.route("/webhook").post(confirmedOrder);

Router.get("/:id", getOrderById);

Router.get('/stores/:id', getStoreOrdersById);


Router.route('/').post(createOrderValidator, validationResult, createOrder);

Router.get('/:id', getOrderById);

Router.put('/order_edit/:id', updateOrderAsCustomer);

Router.put('/order_admin_edit/:id', updateOrderAsAdmin);

Router.put('/:orderId/status', updateOrderStatus);

Router.delete('/:id', deleteOrderByAdmin);



module.exports = Router;
