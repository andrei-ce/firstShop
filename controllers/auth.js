const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendMail = require('../services/nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.getLogin = async (req, res) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignup = async (req, res) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: { email: '', password: '', confirmPassword: '' },
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res) => {
  try {
    //inputs
    let { email, password } = req.body;

    //errors
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
      });
    }

    //logic
    let user = await User.findOne({ email: req.body.email });
    let doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      console.log('Match!');
      //use .save() method to make sure it redirects only when session is already created
      req.session.user = user;
      req.session.isAuth = true;
      req.session.save(() => {
        return res.redirect('/');
      });
    } else {
      req.flash('error', 'Invalid email or password C');
      return res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = async (req, res) => {
  try {
    req.session.destroy((error) => {
      res.redirect('/');
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postSignup = async (req, res) => {
  try {
    //inputs
    let { email, password, confirmPassword } = req.body;
    //errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password, confirmPassword },
        validationErrors: errors.array(),
      });
    }
    //logic
    const salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
    let user = new User({ email, password: hashedPassword, cart: { items: [] } });
    await user.save();

    //confirmation email not blocking the redirect:
    res.redirect('/login');
    return await sendMail({
      to: email,
      from: 'admin@first-shop.com',
      subject: 'Signup successfull ✅',
      html: '<h1>Congratulationg</h1><h4>Your account in shop.com has been created</h4>',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getReset = async (req, res) => {
  try {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/reset', {
      path: '/reset-password',
      pageTitle: 'Reset',
      errorMessage: message,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postReset = async (req, res) => {
  console.log('In post reset page');
  try {
    crypto.randomBytes(32, async (error, buffer) => {
      if (error) {
        return res.redirect('/reset-password');
      }
      const token = buffer.toString('hex');
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash('error', 'No such account found.');
        return res.redirect('/reset-password');
      } else {
        (user.resetToken = token), (user.resetTokenExpiration = Date.now() + 3600000);
        await user.save();
      }
      //not blocking the email sending part...
      res.redirect('/');
      return await sendMail({
        to: user.email,
        from: 'admin@first-shop.com',
        subject: 'Your reset password link 🔑',
        html: `
          <h1>Hello</h1>
          <h4>Click <a href="http://localhost:3000/reset-password/${token}">this link</a> to continue the reset password process</h4>
        `,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const token = req.params.token;
    let user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postNewPassword = async (req, res) => {
  try {
    const { password, userId, passwordToken } = req.body;
    let resetUser = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetToken = undefined;
    await resetUser.save();

    return res.redirect('auth/login');
  } catch (error) {
    console.log(error);
  }
};
