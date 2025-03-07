const Member = require("../models/member.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

exports.updateMember = async (req, res) => {
  try {
    const { memberName, yob, gender } = req.body;
    console.log("memberName", memberName);
    console.log("yob", yob);
    console.log("gender", gender);
    if (req.session.user._id !== req.params.memberId) {
      return res.status(403).send("You can only update your own information");
    }
    const member = await Member.findByIdAndUpdate(
      req.params.memberId,
      { memberName, yob, gender },
      { new: true }
    );
    req.session.user = member;
    req.session.save((err) => {
      if (err) {
        return res.status(500).send("Session save failed");
      }
      req.flash("success_msg", "Update Profile Successfully");
      res.redirect("/member/:memberId/update"); // Only redirect after saving session
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect("/member/:memberId/update");
    res.status(400).send(error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log("oldPassword", oldPassword);
    console.log("newPassword", newPassword);
    const member = await Member.findById(req.session.user._id);
    if (!(await bcrypt.compare(oldPassword, member.password))) {
      req.flash("error_msg", "Old password is incorrect");
      return res.redirect(`/member/${req.session.user._id}/changePassword`);
    }
    member.password = newPassword;
    await member.save();
    req.flash("success_msg", "Password changed successfully");
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.redirect("/auth/login");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect(`/member/${req.session.user._id}/changePassword`);
  }
};

exports.getAllCollectors = async (req, res) => {
  try {
    const memberData = await Member.find();
    return res.render("collectors", {
      title: "Collectors",
      members: memberData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
