const path = require('path');
const mongoose = require('mongoose');
const CustomerModel = mongoose.model('Customer');
const Admin = mongoose.model('Admin');
const SuperAdmin = mongoose.model('SuperAdmin');
const jwt = require('../util/jwt');
const mailer = require('nodemailer');
const createError = require(path.join(__dirname, '..', 'util', 'error'));
const passwordHandle = require(path.join(
  __dirname,
  '..',
  'util',
  'password-handle',
));
const { sendResetEmail } = require(path.join(
  __dirname,
  '..',
  'util',
  'nodemailer',
));

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await CustomerModel.findOne({ email: email });
    if (
      !customer ||
      !(await passwordHandle.compare(password, customer.password))
    )
      return next(createError('Email or password is wrong.', 401));
    if (!customer.isActive)
      return next(createError('Activate your email please.', 401));
    const token = jwt.create({ id: customer._id, role: 'customer' });
    res.status(200).json({
      message: 'success',
      customer,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { role, fullName, password } = req.body;
    let admin;
    role === 'admin'
      ? (admin = await Admin.findOne({ fullName: fullName }).populate('store'))
      : (admin = await SuperAdmin.findOne({
          fullName: fullName,
        }));
    if (!admin || !(await passwordHandle.compare(password, admin.password)))
      return next(createError('Email or password is wrong.', 401));
    // console.log('storeId', admin.store._id);
    // console.log('admminId', admin._id);
    const token = jwt.create(
      { id: admin._id, role: role, storeId: admin.store._id },
      '8h',
    );
    if (role === 'admin') {
      admin.token = 'Bearer ' + token;
      await admin.save(); // Save the updated admin object to the database
    } else {
      admin.token = 'Bearer ' + token;
      await admin.save(); // Save the updated admin object to the database
    }
    res.status(200).json({
      message: 'success',
      admin,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const customer = await CustomerModel.findOne({ email: email });
    if (!customer) next(createError('Email is wrong.', 401));
    if (!customer.isActive)
      next(createError('Activate your email please.', 401));
    const token = jwt.create({ id: customer._id, role: 'customer' });
    const resetURL = process.env.FRONT_URL + '/reset/?token=' + token;
    const error = await sendResetEmail(email, resetURL);
    error
      ? next(error)
      : res.status(200).json({
          message: 'success',
        });
  } catch (err) {
    next(err);
  }
};
