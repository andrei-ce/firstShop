const User = require('../models/user');
// const returnError = require('../services/returnError');

module.exports = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    let user = await User.findById(req.session.user._id);
    if (!user) {
      return next();
    }
    req.user = user;
    next();
  } catch (error) {
    returnError(error, next);
  }
};
