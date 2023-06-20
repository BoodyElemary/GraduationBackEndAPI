const express = require('express');
const path = require('path');
const router = express.Router();
// routes files path

const voucherRouter = require(path.join(__dirname, 'voucher.routes'));
const baseRouter = require(path.join(__dirname, 'base.routes'));
const flavorRouter = require(path.join(__dirname, 'flavor.routes'));
const toppingRouter = require(path.join(__dirname, 'topping.routes'));
const categoryRouter = require(path.join(__dirname, 'category.routes'));
const productRouter = require(path.join(__dirname, 'product.routes'));
const adminRouter = require(path.join(__dirname, 'admin.routes'));
const orderRouter = require(path.join(__dirname, 'order.routes'));
const storeRouter = require(path.join(__dirname, 'store.routes'));
const notFoundRoute = require(path.join(__dirname, 'not-found.routes'));
const authenticationRoute = require(path.join(
  __dirname,
  'authentication.routes',
));
const customerRoute = require(path.join(__dirname, 'customer.routes'));
//add routes here
router.use('/api/login', authenticationRoute);
router.use('/api/bases', baseRouter);
router.use('/api/flavors', flavorRouter);
router.use('/api/toppings', toppingRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/products', productRouter);
router.use('/api/admin', adminRouter);
router.use('/api/customers', customerRoute);

//add routes here
router.use('/api/bases', baseRouter);
router.use('/api/flavors', flavorRouter);
router.use('/api/toppings', toppingRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/products', productRouter);
router.use('/api/order', orderRouter);
router.use('/api/login', authenticationRoute);
router.use('/api/bases', baseRouter);
router.use('/api/flavors', flavorRouter);
router.use('/api/toppings', toppingRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/products', productRouter);
router.use('/api/admin', adminRouter);
router.use('/api/vouchers', voucherRouter);
router.use('/api/orders', orderRouter);
router.use('/api/stores', storeRouter);

// not found route
router.use('*', notFoundRoute);

module.exports = router;
