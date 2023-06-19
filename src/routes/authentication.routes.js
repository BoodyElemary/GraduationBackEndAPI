const path = require("path");
const express = require("express");
const authCtrl = require(path.join(
  __dirname,
  "..",
  "controller",
  "authentication.controller"
));
const router = express.Router();

router.route("/login").post(authCtrl.login);
router.route("/login/admin").post(authCtrl.loginAdmin);
router.route("/reset").post(authCtrl.postReset);
router.route("/reset/:token").get(authCtrl.getReset);

module.exports = router;
