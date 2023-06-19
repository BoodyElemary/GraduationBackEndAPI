const express = require('express');
const path = require('path');
const notFoundRoute = require(path.join(__dirname, 'not-found.routes'));
const router = express.Router();
// routes files path
const baseRouter = require(path.join(__dirname, 'base.routes'));
const flavorRouter = require(path.join(__dirname, 'flavor.routes'));
const toppingRouter = require(path.join(__dirname, 'topping.routes'));
const categoryRouter = require(path.join(__dirname, 'category.routes'));
const productRouter = require(path.join(__dirname, 'product.routes'));
const orderRouter = require(path.join(__dirname, 'order.routes'));
const voucherRouter=require(path.join(__dirname,'voucher.routes'))

//add routes here
router.use('/api/bases',baseRouter);
router.use('/api/flavors',flavorRouter);
router.use('/api/toppings',toppingRouter);
router.use('/api/categories',categoryRouter);
router.use('/api/products',productRouter);
router.use('/api/order',orderRouter);
router.use('/api/vouchers',voucherRouter);


// not found route
router.use('*', notFoundRoute);

module.exports = router;
