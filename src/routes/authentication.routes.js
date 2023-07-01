const path = require("path");
const express = require("express");
const authCtrl = require(path.join(
  __dirname,
  "..",
  "controller",
  "authentication.controller"
));
const {
  loginValidation,
  loginAdminValidation,
  resetPasswordValidation,
} = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validators",
  "authentication.validator"
));
const validationResult = require(path.join(
  __dirname,
  "..",
  "middleware",
  "validation.mw"
));
const router = express.Router();

const {passport} = require('../controller/social-media-auth.controller');

router.route("/").post(loginValidation, validationResult, authCtrl.login);

router
  .route("/admin")
  .post(loginAdminValidation, validationResult, authCtrl.loginAdmin);

router
  .route("/reset")
  .post(resetPasswordValidation, validationResult, authCtrl.passwordReset);


router.route("/facebook").get(passport.authenticate('facebook', { session: false }, {scope: 'email'}));

router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', { session: false },
  (error, user, info) => {
    // Handle the authentication result
    if (error) {
      // Handle error
      return res.status(500).json({ message: error });
    }
    if (!user) {
      // Handle authentication failure
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Authentication success, generate a token and return it in the response
    return res.json(user);
  })(req, res, next);
});


router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' },
  (error, user, info) => {
    // Handle the authentication result
    if (error) {
      // Handle error
      return res.status(500).json({ message: error });
    }
    if (!user) {
      // Handle authentication failure
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Authentication success, generate a token and return it in the response
    return res.json(user);
  })(req, res, next);
});


module.exports = router;
