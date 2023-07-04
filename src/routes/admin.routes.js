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
const { isAdmin, isSuperAdmin } = require(path.join(
  __dirname,
  "..",
  "middleware",
  "auth.mw"
));
const router = express.Router();

router
  .route("/")
  .get(isSuperAdmin, adminCtrl.getAllAdmins)
  .post(
    isSuperAdmin,
    newAdminValidation,
    validationResult,
    adminCtrl.addNewAdmin
  )
  .put(isSuperAdmin, validationResult, adminCtrl.updateAdmin);
router
  .route("/id/:id")
  .all(isSuperAdmin, paramIdValidation, validationResult)
  .get(adminCtrl.getAdminData)
  .delete(adminCtrl.deleteAdmin);
router.route("/profile").get(isAdmin, adminCtrl.getAdminDataByProfilePath);
router
  .route("/store/:store")
  .get(
    isSuperAdmin,
    storeIdValidation,
    validationResult,
    adminCtrl.getStoreAdmins
  );
router.route("/search/:query").get(isSuperAdmin, adminCtrl.adminSearch);

module.exports = router;
