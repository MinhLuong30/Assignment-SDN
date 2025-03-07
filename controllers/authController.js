const mongoose = require("mongoose");
const Member = require("../models/member.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/authorize");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const member = await Member.findOne({ email });

    if (!member || !(await bcrypt.compare(password, member.password))) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/auth/login");
    }

    // Create session user object

    // Save session data
    req.session.user = {
      _id: member._id,
      memberName: member.memberName,
      email: member.email,
      yob: member.yob,
      gender: member.gender,
      isAdmin: member.isAdmin,
    };

    // Generate JWT token
    const token = jwt.sign({ _id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.session.save((err) => {
      if (err) {
        req.flash("error_msg", "Session save failed");
        return res.redirect("/auth/login");
      }
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect("/auth/login");
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, memberName, yob, gender } = req.body;

    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "User already exits");
      return res.redirect("/auth/register");
    }

    const newUser = new Member({ email, password, memberName, yob, gender });
    await newUser.save();

    res.redirect("/auth/login");
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect("/auth/register");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("/"); // Only redirect after saving session
  });
};
