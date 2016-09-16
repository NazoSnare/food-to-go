"use strict";

const expect = require("chai").expect;
const userModel = require("../models/order");

let user;

describe("User Model - New User", () => {
	before(() => {
		order = userModel.newUser("name", "password", 99);
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
		// guid with length of 36 - 32 chars 4 dashes
		expect(user.id).to.be.a("string");
		expect(user.id.length).to.equal(36);
		expect(user.username).to.be.a("string");
		expect(user.username).to.equal("name");
		expect(user.password).to.be.a("string");
		expect(user.password).to.equal("password");
		expect(user.storeAccount).to.be.a("boolean");
		expect(order.storeAccount).to.equal(false);
		expect(order.level).to.be.a("number");
		expect(order.level).to.equal(99);
		return done();
	});
});
