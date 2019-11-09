const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

let User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        console.log("deu ruim");
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);

    return { error: "unknown" }
}));