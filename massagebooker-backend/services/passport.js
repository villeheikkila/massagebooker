const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../utils/config');
const User = require('../models/user');

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id).then(foundUser => done(null, foundUser)));

passport.use(
    new GoogleStrategy(
        {
            clientID: config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true,
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id }).then(foundUser => {
                if (foundUser) done(null, foundUser);
                else {
                    // New user registration, add to database if email is whitelisted or has the whitelisted email suffix
                    if (
                        profile.emails[0].value.split('@')[1] === config.EMAIL_SUFFIX ||
                        config.EMAIL_WHITELIST.includes(profile.emails[0].value)
                    ) {
                        const admin = profile.emails[0].value === config.INITIAL_ADMIN ? true : false;

                        new User({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            admin,
                            avatarUrl: profile.photos[0].value,
                        })
                            .save()
                            .then(createdUser => done(null, createdUser));
                    } else done(null, false, { message: 'email suffix not allowed' });
                }
            });
        },
    ),
);
