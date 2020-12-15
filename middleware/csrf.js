const csrf = require('csurf');

module.exports = {
  csrfProtection: csrf(),
  setEjsLocalVariables: (req, res, next) => {
    console.log('csrf token running...');
    res.locals.isAuth = req.session.isAuth; //undefined if not logged in
    res.locals.csrfToken = req.csrfToken(); //ok
    next();
  },
};
