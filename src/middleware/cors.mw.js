const cors = require("cors");
module.exports = cors({
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "DELETE", "PUT"],
  Headers: ["Content-Type", "Authorization"],
});