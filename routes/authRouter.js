const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

authRouter.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Register
authRouter.post("/register", async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout
authRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
});

module.exports = authRouter;
