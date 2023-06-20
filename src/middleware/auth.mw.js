const path = require("path");
const mongoose = require("mongoose");
const jwt = require("../util/jwt");
const createError = require(path.join(__dirname, "..", "util", "error"));
const Admin = mongoose.model("Admin");
const SuperAdmin = mongoose.model("SuperAdmin");

const isLogin = async (req, res, next) => {
  try {
    let token = req.get("authorization");
    if (!token) next(createError("Login to auth", 403));
    let user = jwt.verify(token.split(" ")[1]);
    if (
      (user.role === "admin" &&
        (await Admin.findById(user.id, { token: 1 })).token === token) ||
      (user.role === "super" &&
        (await SuperAdmin.findById(user.id, { token: 1 })).token === token) ||
      user.role === "customer"
    ) {
      req.user = user;
      next();
    } else {
      next(createError("Admin already logged in", 409));
    }
  } catch (error) {
    next(error);
  }
};

const isAuthorized = (req, res, next) => {
  const allowed = false;
  let allowedRoutes;
  if (req.user.role === "customer") {
    allowedRoutes = [
      { path: "/api/blabla", methods: ["POST", "GET"] }, //example
      { path: "/api/blabla", methods: ["GET"] }, //example
    ];
  } else if (req.user.role === "admin") {
    allowedRoutes = [{ path: "/api/admin/profile", methods: ["GET"] }];
  } else if (req.user.role === "super") {
    return next();
  } else next(createError("Unknown user role!!"));
  allowed = allowedRoutes.some((route) => {
    const pathMatches = req.path === route.path;
    const methodMatches = route.methods.includes(req.method);
    return pathMatches && methodMatches;
  });
  if (!allowed) {
    next(createError("Unauthorized route or method", 401));
  } else next();
};

module.exports = [isLogin, isAuthorized];
