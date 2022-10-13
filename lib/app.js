"use strict";

const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");
const flash = require("express-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const initializePassport = require("../middleware/authorization");
const { addUser, getUser } = require("./database");

if(process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Below are routes for passport style authentication

initializePassport(passport, getUser);

// Point the view directory to views
app.set("views", path.join(__dirname, "..", "views"));
// Set the view engine to ejs
app.set("view engine", "ejs");
// Allow app to parse form data in a POST request
app.use(express.urlencoded({ extended: false }));
// Allow app to parse json data in a POST request object
app.use(express.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// 404 Handler. Render this page in the case of a 404.
function not_found(req, res) {
  res.status(404).render("404");
}

app.get("/", checkAuthenticated, (req, res) => {
  res.render("home", {
    name: req.user.name,
  });
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    // TODO: sanitize and check user submitted name, email and password
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    await addUser(req.body.name, req.body.email, hashed_password);
    res.redirect("/login");
  }
  catch (err) {
    res.redirect("/register");
  }
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
}));

app.delete("/logout", (req, res) => {
  req.logOut(err => {
    if(err) { return res.redirect("/"); }
    res.redirect("/login");
  });
});

// End passport registration and login routes

app.use(not_found);

// Check authenticated user for passport routes
function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = app;
