const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      const email = emails[0].value;

      try {
        let user = await User.findOne({ email });
        if (user) {
          done(null, user);
        } else {
          user = new User({
            name: displayName,
            email,
            password: "",
            role: "patient",
            phone: "",
            emailVerified: true,
            phoneVerified: false,
          });
        }

        await user.save();
        done(null, user);
      } catch (error) {
        console.error(err.message);
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
