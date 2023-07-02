const cors = require("cors");
const geoip = require("geoip-lite");
const rateLimit = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");

const createError = require(path.join(__dirname, "..", "util", "error"));

const corsProvider = cors({
  origin: "*", //To set it to front url
  methods: ["GET", "POST", "DELETE", "PUT"],
  Headers: ["Content-Type", "Authorization"],
});

const noBody = (req, res, next) => {
  if ((req.method === "GET" || req.method === "DELETE") && req.body) {
    const err = new Error("Body not allowed for GET or DELETE requests");
    err.status = 400;
    return next(err);
  }
  next()
};

const lengthControl = (req, res, next) => {
  const contentLength = req.headers["content-length"];
  if (contentLength && parseInt(contentLength) > 10000000 /*10mb*/) {
    next(createError("Request entity too large", 413));
  }
  next();
};

function restrictToCountries(countries) {
  return function (req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    let country = null;
    if (ip === "::1" || ip === "127.0.0.1") {
      country = "localhost";
    } else {
      const geoData = geoip.lookup(ip);
      country = geoData?.country;
    }
    if (countries.includes(country)) {
      next();
    } else {
      next(createError("Access denied", 403));
    }
  };
}
const allowedCountries = ["US", "CA", "MX", "EG", "localhost"];

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 60 requests per minute
});

module.exports = [
  corsProvider,
  noBody,
  lengthControl,
  restrictToCountries(allowedCountries),
  limiter,
  helmet(),
];
