"use strict";

const expect = require("chai").expect;
const orderModel = require("../models/order");
const itemModel = require("../models/item");

let order;
let item;

describe("Order Model - New Order", () => {
	before(() => {
		order = orderModel.newOrder();
		item = itemModel.newItem("name", "cat", "desc", "price");
		orderModel.addItem(order, item);
	});

	it("order should be a valid object", (done) => {
		expect(order).to.not.be.an("undefined");
		expect(order).to.be.an("object");
		return done();
	});

	it("order should have required properties", (done) => {
		expect(order).to.have.property("error");
		expect(order).to.have.property("id");
		expect(order).to.have.property("dateTime");
		expect(order).to.have.property("status");
		expect(order).to.have.property("state");
		expect(order).to.have.property("location");
		expect(order).to.have.property("method");
		expect(order).to.have.property("customerName");
		expect(order).to.have.property("customerAddress");
		expect(order).to.have.property("customerPhone");
		expect(order).to.have.property("items");
		return done();
	});

	it("order should have the correct starting values", (done) => {
		expect(order.error).to.be.a("boolean");
		expect(order.error).to.equal(false);
		// guid with length of 36 - 32 chars 4 dashes
		expect(order.id).to.be.a("string");
		expect(order.id.length).to.equal(36);
		expect(order.dateTime).to.be.a("Date");
		expect(order.status).to.be.a("string");
		expect(order.status).to.equal("preparing");
		expect(order.state).to.be.a("string");
		expect(order.state).to.equal("in-progress");
		expect(order.location).to.be.a("string");
		expect(order.location).to.equal("store#");
		expect(order.method).to.be.a("string");
		expect(order.method).to.equal("delivery");
		expect(order.customerName).to.be.a("string");
		expect(order.customerName).to.equal("name");
		expect(order.customerAddress).to.be.a("string");
		expect(order.customerAddress).to.equal("address");
		expect(order.customerPhone).to.be.a("string");
		expect(order.customerPhone).to.equal("123-456-7890");
		// should be and Array[1]
		expect(order.items).to.be.an("array");
		expect(order.items.length).to.equal(1);
		// array item should be an object
		expect(order.items[0]).to.be.an("object");

		return done();
	});
});
