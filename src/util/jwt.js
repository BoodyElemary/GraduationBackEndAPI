const jwt = require("jsonwebtoken");
module.exports.create = (
  payload,
  expiresIn = "1d",
  key = process.env.SECRET_KEY
) => {
  return jwt.sign(payload, key, { expiresIn });
};
module.exports.verify = (token, key = process.env.SECRET_KEY) => {
  return jwt.verify(token, key);
};
