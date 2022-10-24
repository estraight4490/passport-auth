"use strict";
const { check, validationResult } = require("express-validator");

const validate_registration = [
  // Check Email
  check("email", "Must be a proper email address.").isEmail().
    trim().escape().normalizeEmail(),
  // Check Password
  check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.").
    matches("[0-9]").withMessage("Password must contain a number.").matches("[A-Z]").
    withMessage("Password must contain an uppercase letter.").trim().escape(),
  // Check Name
  check("name", "Name must contain at least two characters.").isLength({ min: 2 }).
    matches("[A-Z]").trim().escape(),
];

module.exports.validationResult = validationResult;
module.exports.validate_registration = validate_registration;
