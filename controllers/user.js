// controllers/user.js
const User = require("../models/user");

// ========================
// RENDER Signup Form
// ========================
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// ========================
// SIGNUP Logic
// ========================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ========================
// RENDER Login Form
// ========================
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// ========================
// LOGIN Logic
// ========================
module.exports.login = (req, res) => {
  const redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  req.flash("success", "Welcome back!");
  res.redirect(redirectUrl);
};

// ========================
// LOGOUT Logic
// ========================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
};
