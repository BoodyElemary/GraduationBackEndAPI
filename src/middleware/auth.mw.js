const jwt = require('jsonwebtoken');
const path = require('path');

// const Customer = require('../models/customer.model');
const Customer = path.join(__dirname, '..', 'models', 'customer.model');
exports.isLogin = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
      return res.status(403).send({
        success: false,
        message: 'A token is required for authentication',
      });
    }

    try {
      const customerDecoded = jwt.verify(token, process.env.SECRET_KEY);
      const customer = await Customer.findById(customerDecoded.id);

      if (!customer) {
        return res.status(403).send({
          success: false,
          message: 'User not found',
        });
      }

      req.customerId = customerDecoded.id;
      return next();
    } catch (error) {
      return res.status(403).send({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    return res.status(403).send({ success: false, message: 'Not authorized' });
  }
};
