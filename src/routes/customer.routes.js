const express = require('express');
const path = require('path');
const Router = express.Router();

const {
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addVoucherToCustomer,
  getAllCustomers,
  activateAccount,
  getCustomerProfile,

} = require(path.join(__dirname, '..', 'controller', 'customer.controller'));

const{
  getCustomerOrders
} = require(path.join(__dirname, '..', 'controller', 'order.controller'));

// Create a new customer
Router.post('', createCustomer);
// Get a customer profile
Router.get('/profile', getCustomerProfile);

// Get Customer orders
Router.get('/orders', getCustomerOrders);

// Get a customer by ID
Router.get('/:id', getCustomerById);

// Update a customer
Router.put('/:id', updateCustomer);

// Delete a customer
Router.delete('/:id', deleteCustomer);

// Add a voucher to a customer
Router.post('/:id/vouchers', addVoucherToCustomer);

Router.get('/activate/:token', activateAccount);
// Get all customers
Router.get('', getAllCustomers);





module.exports = Router;
