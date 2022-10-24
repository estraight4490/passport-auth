"use strict";
const knex = require("knex");
const config = require("config");

const database_connection = knex(config.get("db_connect_config"));

async function addUser(name, email, hashed_password) {
  try {
    const results = await database_connection("user_account_information").insert({
      name,
      email,
      hashed_password,
    });
    return results;
  }
  catch (err) {
    console.log("ERROR");
    console.log(err);
    throw err;
  }
}

async function getUser(email_or_id, condition="email") {
  try {
    // Returns empty array if no results. Returns array with object in array containing user info
    return await database_connection("user_account_information").where(condition, email_or_id);
  }
  catch (err) {
    console.log("ERROR");
    console.log(err);
    throw err;
  }
}

async function removeUser(email) {
  try {
    return await database_connection("user_account_information").where("email", email).del();
  }
  catch (err) {
    console.log("ERROR");
    console.log(err);
    throw err;
  }
}

module.exports.database_connection = database_connection;
module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.removeUser = removeUser;
