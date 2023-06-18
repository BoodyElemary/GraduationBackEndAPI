const express = require('express');
const path = require('path');
const notFoundRoute = require(path.join(__dirname, 'not-found.routes'));
const router = express.Router();
//add routes here
router.use('*', notFoundRoute);
module.exports = router;
