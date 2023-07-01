const passport = require('passport');
const facbookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");
require('dotenv').config();
const uuid = require("uuid");
const jwt = require('../util/jwt');

function generatePassword() {
    // Define the character set to use for the password
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&';

    // Define the length of the password
    const length = 8;

    // Generate a random password using the defined character set and length
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

passport.use(new facbookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: process.env.FACEBOOK_SECRET_URL,
        profileFields: ['id', 'displayName', 'name', 'email'],
        scope: ['email']
    },
    async function (accessToken, refreshToken, profile, cb){
        const existCustomer = await Customer.findOne({email: profile.emails[0].value})
        if (existCustomer) {
            // If the customer already exists, log them in
            const token = jwt.create({ id: existCustomer._id, role: 'customer' });
            return cb(null, { token, existCustomer, message: 'Login Successfully' });
            } else {
            const activationToken = uuid.v4();
            // console.log(profile);
            const password = generatePassword();
            const newCustomer = await Customer.create({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                phone: '(123) 456-7890',
                password: password,
                activationToken: activationToken,
                isActive: true
            });
            await Customer.findByIdAndUpdate(newCustomer._id, {
              $unset: { activationToken: "" },
            });
            const token = jwt.create({ id: newCustomer._id, role: 'customer' });
            return cb(null, {token, newCustomer, message: 'Login Successfully'});
        }
    }
))

passport.use(new GoogleStrategy({
    clientID:  process.env.GOOGLE_CLIENT_ID,
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_SECRET_URL,
    profileFields: ['id', 'displayName', 'name', 'email', 'userinfo.phone'],
    scope: ['email', 'profile']
  },
  async function (accessToken, refreshToken, profile, cb){
    const existCustomer = await Customer.findOne({email: profile.emails[0].value})

    if (existCustomer) {
        // If the customer already exists, log them in
        const token = jwt.create({ id: existCustomer._id, role: 'customer' });
        return cb(null, { token, customer: existCustomer, message: 'Login Successfully' });
      } else {
        const activationToken = uuid.v4();
        const password = generatePassword();
        const newCustomer = await Customer.create({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            phone: '(123) 456-7890',
            password: password,
            activationToken: activationToken,
            isActive: true
        });
        await Customer.findByIdAndUpdate(newCustomer._id, {
          $unset: { activationToken: "" },
        });
        const token = jwt.create({ id: newCustomer._id, role: 'customer' });
        return cb(null, {token, customer: newCustomer, message: 'Login Successfully'});
    }
}
  ));


module.exports = {passport}
