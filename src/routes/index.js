const express = require("express");
const path = require("path");
const notFoundRoute = require(path.join(__dirname, "not-found.routes"));
const router = express.Router();

router.route("*", notFoundRoute);
module.exports = router;
