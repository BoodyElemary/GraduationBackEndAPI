const path = require("path");
const mongoose = require("mongoose");
const CustomerModel = mongoose.model("Customer");
const Admin = mongoose.model("Admin");
const SuperAdmin = mongoose.model("SuperAdmin");
const jwt = require("../util/jwt");
const mailer = require("nodemailer");
const createError = require(path.join(__dirname, "..", "util", "error"));
const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));
const { sendResetEmail } = require(path.join(
  __dirname,
  "..",
  "util",
  "nodemailer"
));

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await CustomerModel.findOne({ email: email });
    if (
      !customer ||
      !(await passwordHandle.compare(password, customer.password))
    )
      next(createError("Email or password is wrong.", 401));
    if (!customer.isActive)
      next(createError("Activate your email please.", 401));
    const token = jwt.create({ id: customer._id, role: "customer" });
    res.status(200).json({
      message: "success",
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
      ? (admin = await Admin.findOne({ fullName: fullName }))
      : (admin = await SuperAdmin.findOne({
          fullName: fullName,
        }));
    if (!admin || !(await passwordHandle.compare(password, admin.password)))
      next(createError("Email or password is wrong.", 401));
    const token = jwt.create({ id: admin._id, role: role });
    role === "admin"
      ? Admin.findByIdAndUpdate(admin._id, { token })
      : SuperAdmin.findByIdAndUpdate(admin._id, { token: "Bearer " + token });
    res.status(200).json({
      message: "success",
      admin,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    // const customer = await CustomerModel.findOne({ email: email });
    // if (!customer) next(createError("Email is wrong.", 401));
    // if (!customer.isActive)
      // next(createError("Activate your email please.", 401));
    // const token = jwt.create({ id: customer._id, role: "customer" });
    let token = 111
    const resetURL = process.env.FRONT_URL + "/reset/?token=" + token;
    const error = await sendResetEmail(email, resetURL);
    error
      ? next(error)
      : res.status(200).json({
          message: "success",
        });
  } catch (err) {
    next(err);
  }
};
