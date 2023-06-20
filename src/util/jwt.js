const jwt = require("jsonwebtoken");
module.exports.create = (
  payload,
  expiresIn = "100y",
  key = process.env.SECRET_KEY
) => {
  return jwt.sign(payload, key, { expiresIn });
};
module.exports.verify = (token, key = process.env.SECRET_KEY) => {
  return jwt.verify(token, key);
};
