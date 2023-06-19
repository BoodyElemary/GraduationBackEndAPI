const path = require("path");
const mongoose = require("mongoose");
const jwt = require("../util/jwt");
const createError = require(path.join(__dirname, "..", "util", "error"));
const Admin = mongoose.model("Admin");
const SuperAdmin = mongoose.model("SuperAdmin");


// const Customer = require('../models/customer.model');
const Customer = path.join(__dirname, '..', 'models', 'customer.model');
exports.isLogin = async (req, res, next) => {
  try {

    let token = req.get("authorization");
    if (!token) next(createError("Login to auth", 403));
    let user = jwt.verify(token.split(" ")[1]);
    if (
      (user.role === "admin" &&
        (await Admin.findById(user.id, { token: 1 }).token) === token) ||
      (user.role === "super" &&
        (await SuperAdmin.findById(user.id, { token: 1 }).token) === token) ||
      user.role === "customer"
    ) {
      next();
    } else {
      next(createError("Admin already logged in", 409));
    }
  } catch (error) {
    next(error);
/*
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
*/
  }
};
