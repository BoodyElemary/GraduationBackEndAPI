module.exports = (error, req, res, next) => {
  if (process.env.MODE === "dev") {
    const path = require("path");
    const winston = require(path.join(__dirname, "..", "util", "logs-config"));
    winston.error(
      `Error: ${error.status || 500} message: ${
        error || "500 Internal Server Error"
      }`
    );
  }

  res.status(error.status || 500);
  res.json({ message: error + "" || "Internal Server Error" });
};
