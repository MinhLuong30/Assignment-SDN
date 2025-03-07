function protected(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    req.flash("error_msg", "You must login");
    res.redirect("/auth/login");
  }
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  } else {
    req.flash("error_msg", "Admin Only");
    res.redirect("/");
  }
}
function isMember(req, res, next) {
  if (req.session.user && !req.session.user.isAdmin) {
    return next();
  } else {
    req.flash("error_msg", "Only member can do this action");
    res.redirect("/");
  }
}

module.exports = { isAdmin, isMember, protected };
