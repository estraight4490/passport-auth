"use strict";

const expect = require("chai").expect;
require("chai").should();
const request = require("supertest");
const {removeUser, database_connection} = require("../lib/database");
const app = require("../lib/app");

after(async () => {
  await removeUser("bandofthe@hawk.com");
  await database_connection.destroy();
});

describe("User registration", () => {
  it("should display input errors on registration failure", async () => {
    const registration_details = {
      name: "A",
      email: "bademail.com",
      password: "",
    };
    const res = await request(app).post("/register").send(registration_details);
    expect(res.status).that.equal(200);
    res.text.should.include("Name must contain at least two characters.");
    res.text.should.include("Must be a proper email address.");
    res.text.should.include("Password must contain a number.");
    res.text.should.include("Password must be at least 8 characters.");
    res.text.should.include("Password must contain an uppercase letter.");
  });

  it("should register a new user", async () => {
    const registration_details = {
      name: "Guts",
      email: "bandofthe@hawk.com",
      password: "GutsGriffithCasca12",
    };
    const res = await request(app).post("/register").send(registration_details);
    expect(res.status).that.equal(302);
    expect(res.redirect).to.be.true;
  });
});

describe("User login", () => {
  it("should stay on login page on login failure", async () => {
    const res = await request(app).post("/login").send({email: "fake@email.com", password: "12345"});
    expect(res.status).to.equal(302);
    expect(res.redirect).to.be.true;
    expect(res.text).to.equal("Found. Redirecting to /login");
  });
  it("should login and redirect to the home page", async () => {
    const res = await request(app).post("/login").send({email: "bandofthe@hawk.com", password: "GutsGriffithCasca12"});
    expect(res.status).to.equal(302);
    expect(res.redirect).to.be.true;
    expect(res.text).to.equal("Found. Redirecting to /");
  });
});

// TODO: investigate if this requires a session
describe("Logout", () => {
  it("should allow the user to logout", async () => {
    const res = await request(app).delete("/logout");
    expect(res.status).to.equal(302);
    expect(res.redirect).to.be.true;
    expect(res.text).to.equal("Found. Redirecting to /login");
  });
});
