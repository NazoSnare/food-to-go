"use strict";

const expect = require("chai").expect;
const itemModel = require("../models/item");

let item;

describe("Item Model - New Item", () => {
	before(() => {
		item = itemModel.newItem("name", "category", "description", 0.00);
	});

	it("item should be a valid object", (done) => {
		expect(item).to.not.be.an("undefined");
		expect(item).to.be.an("object");
		return done();
	});

	it("item should have required properties", (done) => {
		expect(item).to.have.property("error");
		expect(item).to.have.property("name");
		expect(item).to.have.property("category");
		expect(item).to.have.property("description");
		expect(item).to.have.property("options");
		expect(item).to.have.property("price");
		return done();
	});

	it("item should have the correct starting values", (done) => {
		expect(item.error).to.be.a("boolean");
		expect(item.error).to.equal(false);
		expect(item.name).to.be.a("string");
		expect(item.name).to.equal("name");
		// Is this an appetizer? main meal? what are we?
		expect(item.category).to.be.a("string");
		expect(item.category).to.equal("category");
		// explanation of what it is exactly
		expect(item.description).to.be.a("string");
		expect(item.description).to.equal("description");
		// should be an empty array since we have no items in the order
		expect(item.options).to.be.an("array");
		expect(item.options.length).to.equal(0);
		// should be 0 since there are no items in the order
		expect(item.price).to.be.a("number");
		expect(item.price).to.equal(0.00);

		return done();
	});
});
