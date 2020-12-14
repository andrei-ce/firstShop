const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    let user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
