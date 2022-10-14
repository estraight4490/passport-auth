"use strict";
const { check, validationResult } = require("express-validator");

const validate_registration = [
  // Check Email
  check("email", "Must be a proper email address.").isEmail().
    trim().escape().normalizeEmail(),
  // Check Password
  check("password").isLength({ min: 8 }).withMessage("Password Must Be at Least 8 Characters").
    matches("[0-9]").withMessage("Password Must Contain a Number").matches("[A-Z]").
    withMessage("Password Must Contain an Uppercase Letter").trim().escape(),
  // Check Name
  check("name", "Name must contain at least two characters.").isLength({ min: 2 }).
    matches("[A-Z]").trim().escape(),
];

module.exports.validationResult = validationResult;
module.exports.validate_registration = validate_registration;
