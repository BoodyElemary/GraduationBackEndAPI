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
    if (customer.isBlocked)
      return next(createError("This account has been closed.", 401));
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

    role === "admin"

      ? (admin = await Admin.findOne({ fullName: fullName }).populate('store'))
      : (admin = await SuperAdmin.findOne({
          fullName: fullName,
        }));
    if (!admin || !(await passwordHandle.compare(password, admin.password)))
      return next(createError('Email or password is wrong.', 401));
    // console.log('storeId', admin.store._id);
    // console.log('adminId', admin._id)
    let token;
    if (role === 'admin') {
      token = jwt.create(
        { id: admin._id, role: role, storeId: admin.store._id },
        '8h',
      );
    } else if (role === 'super') {
      token = jwt.create({ id: admin._id, role: role }, '8h');
    }
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
    if (!customer) return res.status(400).json({message: "Email is wrong."})
    if (!customer.isActive) return res.status(400).json({message: "Activate your email please."})
    const token = jwt.create({ id: customer._id, role: 'customer' });
    const resetURL = process.env.FRONT_URL + '/app/reset-password/?token=' + token;
    const error = await sendResetEmail(email, resetURL);
    if (error) return res.status(500).json({message: error})
    else return res.status(200).json({message: 'success'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: error})
  }
};

exports.passwordResetSuccess = async (req, res, next) => {
  try {
    let { newPassword, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken?.id;

    newPassword = await passwordHandle.hash(newPassword);
    // Retrieve the customer using the user ID
    await CustomerModel.findByIdAndUpdate(userId, {$set: {password: newPassword}})
    .then((customer)=>{
      if (!customer) return res.json({message: "Customer not found"})
      return res.json({message: "password reset successfully"})
    })
    .catch((error)=>{ console.log(error); return res.status(500).json({message: error})})

  }
  catch(error){
    return res.status(500).json({message: error})
  }

}
