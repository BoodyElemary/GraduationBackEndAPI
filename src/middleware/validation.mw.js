const { validationResult } = require("express-validator");
const path = require("path");
const createError = require(path.join(__dirname, "..", "util", "error"));

module.exports = (req, res, next) => {
  let result = validationResult(req);
  if (result.errors.length) {
    let errMsg = result.errors.reduce((msg, obj) => msg + obj.msg + "  ", "");
    next(createError(errMsg, 422));
  } else {
    next();
  }
};
