const User = require('../models/user');

exports.getLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuth: false,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuth: false,
  });
};

exports.postLogin = async (req, res) => {
  try {
    let user = await User.findById('5fd341b466206005779998d6');
    req.session.isAuth = true;
    req.session.user = user;
    //make sure it redirects only when session is already created
    req.session.save(() => {
      res.redirect('/');
    });
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

exports.postSignup = async (req, res) => {};
