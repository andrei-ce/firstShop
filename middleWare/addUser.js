const User = require('../models/user');

module.exports = addUserToRequest = async (req, res, next) => {
  req.user = await User.findByPk(1);
  next();
};
