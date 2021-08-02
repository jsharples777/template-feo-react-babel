module.exports = {
  ensureAuthenticated: function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/login');
  },
  forwardAuthenticated: function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }
};