const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    req.flash("error_msg", "Not authorized to access this resource");
    return res.redirect("/login");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.member = await Member.findById(decoded.id);
    next();
  } catch (err) {
    req.flash("error_msg", "Not authorized to access this resource");
    return res.redirect("/login");
  }
};

// Grant access to specific roles
exports.authorize = (isAdmin = true) => {
  return (req, res, next) => {
    if (isAdmin && !req.member.isAdmin) {
      req.flash("error_msg", "Not authorized to access this resource");
      return res.redirect("/");
    }
    next();
  };
};

// Only allow members to edit their own information
exports.ownershipCheck = async (req, res, next) => {
  if (req.params.id !== req.member.id.toString()) {
    req.flash("error_msg", "Not authorized to modify other member information");
    return res.redirect("/");
  }
  next();
};
