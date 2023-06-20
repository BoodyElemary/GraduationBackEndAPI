const express = require("express");
const path = require("path");
const router = express.Router();
// routes files path

const baseRouter = require(path.join(__dirname, "base.routes"));
const flavorRouter = require(path.join(__dirname, "flavor.routes"));
const toppingTypeRouter = require(path.join(__dirname, 'toppingType.routes'));
const toppingRouter = require(path.join(__dirname, "topping.routes"));
const categoryRouter = require(path.join(__dirname, "category.routes"));
const productRouter = require(path.join(__dirname, "product.routes"));
const adminRouter = require(path.join(__dirname, "admin.routes"));
const notFoundRoute = require(path.join(__dirname, "not-found.routes"));
const authenticationRoute = require(path.join(
  __dirname,
  "authentication.routes"
));

//add routes here
router.use("/api/login", authenticationRoute);
router.use("/api/bases", baseRouter);
router.use("/api/flavors", flavorRouter);
router.use('/api/toppingsType',toppingTypeRouter);
router.use("/api/toppings", toppingRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/products", productRouter);
router.use("/api/admin", adminRouter);


// not found route
router.use("*", notFoundRoute);

module.exports = router;
