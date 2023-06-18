const path = require("path");
const mongoose = require("mongoose");
const CustomerModel = mongoose.model("Customer");
const AdminModel = mongoose.model("Admin");
const SuperAdminModel = mongoose.model("SuperAdmin");
const jwt = require("../util/jwt");
const mailer = require("nodemailer");
const createError = require(path.join(__dirname, "..", "util", "error"));
const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));

exports.login = async (req, res, next) => {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (
      !customer ||
      !(await passwordHandle.compare(req.body.password, customer.password))
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
    let admin;
    req.body.role === "admin"
      ? (admin = await AdminModel.findOne({ fullName: req.body.fullName }))
      : (admin = await SuperAdminModel.findOne({
          fullName: req.body.fullName,
        }));
    if (
      !admin ||
      !(await passwordHandle.compare(req.body.password, admin.password))
    )
      next(createError("Email or password is wrong.", 401));
    const token = jwt.create({ id: admin._id, role: req.body.role });
    res.status(200).json({
      message: "success",
      admin,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = (req, res, next) => {
  //ToDo
  next(createError("ToDo", 418));
};
