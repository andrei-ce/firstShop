module.exports = (req, res, next) => {
  console.log('In isAuth middleware....');
  if (!req.session.isAuth) {
    return res.redirect('/login');
  }
  next();
};
