const path = require("path");
const express = require("express");
const adminCtrl = require(path.join(
  __dirname,
  "..",
  "controller",
  "admin.controller"
));
const {
  newAdminValidation,
  updateAdminValidation,
  paramIdValidation,
  storeIdValidation,
} = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validators",
  "admin.validator"
));
const validationResult = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));

const router = express.Router();

router
  .route("/")
  .get(adminCtrl.getAllAdmins)
  .post(newAdminValidation, validationResult, adminCtrl.addNewAdmin)
  .put(updateAdminValidation, validationResult, adminCtrl.updateAdmin);
router
  .route("/:id")
  .all(paramIdValidation, validationResult)
  .get(adminCtrl.getAdminData)
  .delete(adminCtrl.deleteAdmin);
router.route("/profile").get(adminCtrl.getAdminDataByProfilePath);
router
  .route("/store/:store")
  .get(storeIdValidation, validationResult, adminCtrl.getStoreAdmins);
router.route("/search/:query").get(adminCtrl.adminSearch);

module.exports = router;
