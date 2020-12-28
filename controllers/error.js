exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuth: req.session.isAuth });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', { pageTitle: 'Internal Error', path: '/500', isAuth: req.session.isAuth });
};
