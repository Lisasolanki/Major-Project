const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Plugin automatically adds username + password hash + salt fields
// and also gives helper methods like register(), authenticate(), etc.
userSchema.plugin(passportLocalMongoose, {
  usernameField: "username", // use "username" as login field
});

module.exports = mongoose.model("User", userSchema);
