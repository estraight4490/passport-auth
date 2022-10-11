"use strict";

const expect = require("chai").expect;
const request = require("supertest");
const app = require("../lib/app").default;

describe("App", () => {
  it("should return status 302 on home page when user not authenticated", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(302);
  });
  it("should return a status of 404 on hitting a nonexistant route", async () => {
    const res = await request(app).get("/fake");
    expect(res.status).to.equal(404);
  });
});
