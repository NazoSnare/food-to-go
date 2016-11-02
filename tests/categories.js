"use strict";

const expect = require("chai").expect;
const catModel = require("../models/categories");

let category;

describe("Category Model - New Category", () => {
	before(() => {
		category = catModel.newCategory("name");
	});

	it("category should be a valid object", (done) => {
		expect(category).to.not.be.an("undefined");
		expect(category).to.be.an("object");
		return done();
	});

	it("category should have required properties", (done) => {
		expect(category).to.have.property("error");
		expect(category).to.have.property("id");
		return done();
	});

	it("category should have the correct starting values", (done) => {
		expect(category.error).to.be.a("boolean");
		expect(category.error).to.equal(false);
		expect(category.id).to.be.a("string");
		expect(category.id).to.equal("name");
		return done();
	});
});
