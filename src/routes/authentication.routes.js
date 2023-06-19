const path = require("path");
const express = require("express");
const authCtrl = require(path.join(
  __dirname,
  "..",
  "controller",
  "authentication.controller"
));
const { loginValidation, loginAdminValidation } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validators",
  "authentication.validator"
));
const validationResult = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();

router.route("/").post(loginValidation, validationResult, authCtrl.login);
router
  .route("/admin")
  .post(loginAdminValidation, validationResult, authCtrl.loginAdmin);
router.route("/reset").post(authCtrl.passwordReset);

module.exports = router;
