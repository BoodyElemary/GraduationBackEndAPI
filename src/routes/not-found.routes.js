/* eslint-disable no-undef */
const path = require("path");
const express = require("express");
const controller = require(path.join(
  __dirname,
  "..",
  "controller",
  "not-found.controller"
));

const router = express.Router();

router.route("*").all(controller.notFound);

module.exports = router;
