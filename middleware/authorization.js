"use strict";

const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

function initialize(passport, getUser) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUser(email);
    if (user.length === 0) return done(null, false, { message: "No user with that email." });
    const user_data = user[0];
    try {
      if(await bcrypt.compare(password, user_data.hashed_password)) return done(null, user_data);
      return done(null, false, { message: "Password incorrect." });
    }
    catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user_data = await getUser(id, "id");
    return done(null, user_data[0]);
  });
}

module.exports = initialize;
