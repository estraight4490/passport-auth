"use strict";

exports.up = function(knex) {
  return knex.schema.createTable("user_account_information", (table) => {
    table.increments("id");
    table.string("email");
    table.string("hashed_password");
    table.string("name");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_account_information");
};
