const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

// Express Init
const app = express();

// Set up view engine
app.set("view engine", "ejs");

// Set up cookie
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

// passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
  console.log("Connected to MongoDB...");
});

// Set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(5000, () => console.log("App running at port 5000..."));
