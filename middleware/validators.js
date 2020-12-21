const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.validateSignUp = [
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      try {
        const userExists = await User.findOne({ email: email }).select('-password');
        if (userExists) {
          throw new Error('Email already registered, please choose another one');
        } else {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  check('password', 'Please use a password of min 6 characters').trim().isLength({ min: 6 }),
  check('confirmPassword', 'Passwords must match').custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      return false;
    } else {
      return true;
    }
  }),
];

exports.validateLogin = [
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      let emailExists;
      try {
        emailExists = await User.findOne({ email: email }).select('-password');
      } catch (error) {
        console.log(error);
      }
      if (!emailExists) {
        throw new Error('Invalid email or password A');
      } else {
        return true;
      }
    }),
  check('password', 'Invalid email or password B').isLength({ min: 6 }),
];

exports.validateAddProduct = [
  check('title', 'Please enter a letters & numbers product title, minimum 3 characters')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  check('imageUrl', 'Please enter a valid image URL').isURL(),
  check('price', 'Please enter a valid price value').isNumeric(),
  check('description', 'Please enter a description between 10-300 characters').isLength({ min: 10, max: 300 }).trim(),
];
