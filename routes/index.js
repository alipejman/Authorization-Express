const { hashSync } = require("bcrypt");
const userModel = require("../model/user.model");
const { redirectIfIsAuth, authenticate } = require("../middleware");
const express = require("express");
const router = express.Router();

function initRoutes(passport) {
  router.get("/", (req, res) => {
    res.render("index.ejs", { title: "Home" });
  });

  router.get("/register", redirectIfIsAuth, (req, res) => {
    res.render("register.ejs", { title: "Register" });
  });

  router.post("/register", redirectIfIsAuth, async (req, res, next) => {
    try {
      const { fullname: fullName, username, password } = req.body;
      const hashPass = hashSync(password, 10); // هش کردن رمز عبور
      const user = await userModel.findOne({ username });
      
      if (user) {
        req.flash("error", "Username already used!");
        return res.redirect("/register");
      }
      
      await userModel.create({
        fullname: fullName,
        username,
        password: hashPass, // ذخیره رمز عبور هش شده
      });
      
      req.flash("success", "Registration successful! Please log in.");
      return res.redirect("/login");
    } catch (error) {
      next(error);
    }
  });
  

  router.get("/login", redirectIfIsAuth, (req, res) => {
    res.render("login.ejs", { title: "Login" });
  });

  router.post("/login", redirectIfIsAuth, passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get("/logout", authenticate, (req, res) => {
    req.logout((err) => {
      if (err) console.log(err);
      res.redirect('/login');
    });
  });

  router.get("/profile", authenticate, (req, res) => {
    const user = req.user;
    res.render("profile.ejs", {
      title: "Profile",
      user,
    });
  });

  return router;
}

module.exports = initRoutes;
