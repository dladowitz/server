const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("user");

// Alernatively could add this as an anonymous function as an argument to passport.serializeUser
// This is done on passport.deserializeUser
const serializeUserCallback = (user, done) => {
  console.log("\n>>>>>>> passport.serializeUser handed user: ", user);
  console.log("passport.serializeUser pulling out user.id:", user.id);
  console.log(
    `Probably saving mongo user.id to a session as something like { passport: { user:  ${
      user.id
    }} }......`
  );
  console.log(">>>>>>>\n");
  done(null, user.id);
};
passport.serializeUser(serializeUserCallback);

passport.deserializeUser((id, done) => {
  console.log(
    "\n<<<<<<<<< Reading req.session and looking for something like { passport: { user: 'xxxxxxxxx' } }"
  );
  console.log("passport.deserializeUser handed mongo user.id: ", id);
  console.log(
    "passport.deserializeUser searching mongo for user with id: ",
    id
  );
  User.findById(id).then(user => {
    console.log("passport.deserializeUser found user in mongo with id: ", id);
    console.log("Mongo User: ", user);
    console.log("Probably adding User object to req");
    console.log("<<<<<<<<<\n");
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true //allows google strategy to trust heroku proxy server https
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("\n ----- passport.use() callback running -----");
      console.log("accessToken: ", accessToken.slice(0, 20) + ".....");
      console.log("refreshToken: ", refreshToken);
      console.log("Google profile.id: ", profile.id);
      console.log("Google email: ", profile.emails[0].value);
      console.log("\n Looking for a user in MongoDB .....");

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        console.log("Found a user in Mongo with googleId of: ", profile.id);
        console.log("--------------------------\n");

        done(null, existingUser);
      } else {
        console.log("No matching user in Mongo DB.");

        const user = await new User({ googleId: profile.id }).save();

        console.log("Creating a user with googleId now: ", profile.id);
        console.log("-------------------------\n");

        done(null, user);
      }
    }
  )
);
