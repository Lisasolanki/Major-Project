// routes/user.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user.js");

// ========================
// SIGNUP Routes
// ========================
router
  .route("/signup")
  .get(userController.renderSignupForm) // GET /signup → show signup form
  .post(wrapAsync(userController.signup)); // POST /signup → register new user

// ========================
// LOGIN Routes
// ========================
router
  .route("/login")
  .get(userController.renderLoginForm) // GET /login → show login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login // POST /login → login user
  );

// ========================
// LOGOUT Route
// ========================
router.route("/logout").get(userController.logout); // GET /logout → logout user

module.exports = router;
