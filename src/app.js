const path = require("path");
require(path.join(__dirname, "models"));

const express = require("express");
const compression = require("compression");

const securityProviderMW = require(path.join(
  __dirname,
  "middleware",
  "security-provider.mw"
));
const errorMW = require(path.join(__dirname, "middleware", "error.mw"));
const app = express();
const routes = require(path.join(__dirname, "routes"));

app.use(securityProviderMW);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(errorMW);

module.exports = app;
