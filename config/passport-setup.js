const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser((id, done) => {
  User.findById({ _id: id })
    .then(user => done(null, user))
    .catch(err => console.log(err.message));
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strat
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      // check if user already exists in DB
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          console.log(`User is: ${currentUser}`);
          done(null, currentUser);
        } else {
          // Create new user & save to DB
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture
          })
            .save()
            .then(newUser => {
              console.log(`New User: ${newUser}`);
              done(null, newUser);
            })
            .catch(err => console.log(err.message));
        }
      });
    }
  )
);
