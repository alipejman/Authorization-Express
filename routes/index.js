const { hashSync } = require("bcrypt");
const { title } = require("process");
const userModel = require("../model/user.model");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index.ejs", { title: "Home" });
});
router.get("/register", (req, res) => {
  res.render("register.ejs", { title: "Signin" });
});
router.post("/register", async (req, res, next) => {
  try {
    const { fullname: fullName, username, password } = req.body;
    const hashPass = hashSync(password, 10);
    const user = await userModel.findOne({ username });
    if (user) {
      const referrer = req?.header("referrer") ?? req.headers.referer;
      req.flash("error", "UserName Already Used !");
      return res.redirect(referrer ?? "/register");
    }
    await userModel.create({
      fullname: fullName,
      username,
      password,
    });
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});
router.get("/login", (req, res) => {
  res.render("login.ejs", { title: "Login" });
});
router.get("/profile", (req, res) => {
  res.render("profile.ejs", {
    title: "Profile",
    user: { _id: "", fullName: "", userName: "", password: "" },
  });
});

module.exports = router;
