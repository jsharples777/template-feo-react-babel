module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },
  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
};
