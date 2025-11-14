// ==========================
// Load ENV (only in dev)
// ==========================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ==========================
// Imports
// ==========================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const wrapAsync = require("./utils/wrapAsync");

const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");

const listings = require("./routes/listing");
const reviews = require("./routes/review");
const userRoutes = require("./routes/user");

// ==========================
// DB URL
// ==========================
const dbUrl = process.env.ATLASDB_URL;

// ==========================
// Mongo Store FIXED
// ==========================
const store = MongoStore.create({
  mongoUrl: dbUrl,            // ✔ FIXED key (mongoUrl, not mongourl)
  crypto: {
    secret: process.env.SECRET ,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("❌ ERROR IN SESSION STORE", err);
});

// ==========================
// Session Options
// ==========================
const sessionOptions = {
  store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

// ==========================
// Mongoose Connection
// ==========================
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MONGO ERROR:", err));


// Make MAPTILER_KEY available to every page
app.use((req, res, next) => {
  res.locals.MAPTILER_KEY = process.env.MAPTILER_KEY;
  next();
});

// ==========================
// View Engine
// ==========================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==========================
// Middleware
// ==========================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

// ==========================
// Passport Auth
// ==========================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// Flash + User Middleware
// ==========================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ==========================
// Routes
// ==========================
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoutes);

// ==========================
// Demo User Route (optional)
// ==========================
app.get(
  "/demouser",
  wrapAsync(async (req, res) => {
    const fakeUser = new User({
      email: "demouser@example.com",
      username: "demo_user",
    });
    const registeredUser = await User.register(fakeUser, "helloworld");
    res.send("Demo user registered successfully!");
  })
);

// ==========================
// Start Server
// ==========================
app.listen(8080, () => {
  console.log(" Server running at http://localhost:8080");
});
