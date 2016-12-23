"use strict";

const expect = require("chai").expect;
const userModel = require("../models/users");
const bcrypt = require("bcrypt");

let user;

describe("User Model - New User", () => {
	before(() => {
		user = userModel.newUser("name", "ftgdefault", 99);
	});

	it("user should be a valid object", (done) => {
		expect(user).to.not.be.an("undefined");
		expect(user).to.be.an("object");
		return done();
	});

	it("user should have required properties", (done) => {
		expect(user).to.have.property("error");
		expect(user).to.have.property("id");
		expect(user).to.have.property("username");
		expect(user).to.have.property("password");
		expect(user).to.have.property("storeAccount");
		expect(user).to.have.property("authLevel");
		return done();
	});

	it("user should have the correct starting values", (done) => {
		expect(user.error).to.be.a("boolean");
		expect(user.error).to.equal(false);
		expect(user.id).to.be.a("string");
		expect(user.id).to.equal("name");
		expect(user.username).to.be.a("string");
		expect(user.username).to.equal("name");
		expect(user.password).to.be.a("string");
		expect(user.password.length).to.equal(60);
		expect(user.storeAccount).to.be.a("boolean");
		expect(user.storeAccount).to.equal(false);
		expect(user.authLevel).to.be.a("number");
		expect(user.authLevel).to.equal(99);
		return done();
	});
});

describe("User Model - Get User ", () => {
	before(function* before() {
		user = yield userModel.getUser("admin", "ftgdefault", true);
		console.log(user);
	});

	it("Returned user should be a valid object", (done) => {
		expect(user).to.not.be.an("undefined");
		expect(user).to.be.an("object");
		return done();
	});
});
