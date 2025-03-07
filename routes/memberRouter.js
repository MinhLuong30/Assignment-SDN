const express = require("express");
const memberRouter = express.Router();
const memberController = require("../controllers/memberController");
const { isAdmin } = require("../middleware/authorize");
const { protected } = require("../middleware/authorize");

memberRouter.get("/:memberId/update", protected, (req, res) => {
  res.render("updateMember", { title: "Profile", user: req.session.user });
});
memberRouter.post("/:memberId/update", memberController.updateMember);

memberRouter.get("/:memberId/changePassword", protected, (req, res) => {
  res.render("changePassword", {
    title: "Change Password",
    user: req.session.user,
  });
});

memberRouter.get("/collectors", isAdmin, memberController.getAllCollectors);

memberRouter.post("/:memberId/changePassword", memberController.changePassword);

module.exports = memberRouter;
