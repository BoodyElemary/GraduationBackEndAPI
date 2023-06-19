const path = require("path");
const mongoose = require("mongoose");
const jwt = require("../util/jwt");
const createError = require(path.join(__dirname, "..", "util", "error"));
const Admin = mongoose.model("Admin");
const SuperAdmin = mongoose.model("SuperAdmin");

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
  }
};
