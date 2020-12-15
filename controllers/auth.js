const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect('/login');
    }
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
    let { email, password, confirmPassword } = req.body;
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.redirect('/signup');
    } else {
      const salt = await bcrypt.genSalt(12);
      password = await bcrypt.hash(password, salt);
      let user = new User({ email, password, cart: { items: [] } });

      await user.save();
      return res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
  }
};
