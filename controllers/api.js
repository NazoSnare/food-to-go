"use strict";

const config = require("../config.json");
const stripe = require("../helpers/stripe.js");
const google = require("../helpers/google.js");
const parse = require("co-body");
const db = require("../helpers/db");
const orderModel = require("../models/order");
const itemModel = require("../models/item");

/**
* newOrder
* Creates a new order, and sends the client back the information
*
*/
module.exports.newOrder = function* newOrder() {
	const params = this.request.body;
	if (!params.location && !params.method) {
		this.status = 400;
		return this.body = {error: true, message: "Must include location and method"};
	}
	const order = orderModel.newOrder(params.location, params.method);
	if (order.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}

	// save order to db
	const result = yield db.saveDocument(order, "orders");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}
	// save id to session.
	this.session.id = order.id;

	// return result
	return this.body = result;

};

module.exports.getOrder = function* getOrder() {
	const params = this.request.body;

	if (!this.session.id) {
		this.status = 400;
		return this.body = {error: true, message: "Must include orderID"};
	}

	const order = yield db.getDocument(this.session.id, "orders");
	if (order.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}

	return this.body = order;
};

module.exports.saveInfo = function* saveInfo() {

	const params = this.request.body;
	if (!params.name && !params.address && !params.phone) {
		this.status = 400;
		return this.body = {error: true, message: "Must include name address and phone number!"};
	}

	const order = yield orderModel.newOrder();
	if (order.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}

	const result = yield orderModel.addCustInfo(order, params.name, params.address, params.phone);
	if (order.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}

	const document = yield db.saveDocument(order, "orders");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}

	// save id to session.
	this.session.id = order.id;

	return this.body = document;

};

module.exports.getAllItems = function* getAllItems() {
	const params = this.request.body;

	const item = yield db.getAllItems();
	if (item.error === true) {
		this.status = 400;
		return this.body = {error: true, message: item.message};
	}

	return this.body = item;
};

module.exports.addItem = function* addItem() {
	const params = this.request.body;
	if (!params.item && !this.session.id) {
		this.status = 400;
		return this.body = {error: true, message: "Must include an item, and the orderID"};
	}

	if (params.item === null) {
		this.status = 400;
		return this.body = {error: true, message: "Can't add an empty item"};
	}

	let order = yield db.getDocument(this.session.id, "orders");
	if (order.error === true) {
		// something went wrong during load
		console.log("Something went wrong getting the order");
		return order;
	}
	const item = params.item;
	order = orderModel.addToTotal(order, item.price);
	order = orderModel.addItem(order, item);
	if (order.error === true) {
		// something went wrong during adding item
		console.log("Something went wrong during adding");
		return order;
	}

	order = yield db.saveDocument(order, "orders");
	if (order.error === true) {
		// something went wrong during saving
		console.log("Something went wrong saving the order");
		return order;
	}

	return this.body = order;
};

module.exports.cart = function* cart() {
	const document = yield db.getDocument(this.session.id, "orders");
	this.session.total = document.orderTotal;
	const total = (document.orderTotal / 100);

	yield this.render("payment/payment", {
		chargeAmount: total,
		script: "payment/payment"
	});
};

module.exports.payment = function* payment() {
	const params = this.request.body;

	if (!params.stripeToken) {
		this.throw(400, "Sorry, something has gone awry.");
	}
	if (!this.session.total) {
		this.throw(400, "A purchase amount was not supplied.");
	}

	const charge = yield stripe.charge(params.total, params.stripeToken);

	this.session.pid = charge.id;

	yield this.render("payment/payment_success", {
		id: charge.id,
		script: "payment/success"
	});
};

module.exports.savepid = function* savepid() {
	const document = yield db.getDocument(this.session.id, "orders");

	let order = orderModel.addPaymentID(document, this.session.pid);
	order = orderModel.changeState(order, "paid");

	const result = yield db.saveDocument(order, "orders");

	return this.body = result;
};

module.exports.geocode = function* geocode() {
	const params = this.request.body;
	if (!params.address) {
		this.throw(400, "You must supply an address to geocode");
	}

	const geocode = yield google.geocode(params.address);
	console.log(geocode[0].formatted_address);

	const result = yield google.matrix(geocode[0].formatted_address);
	const distance = parseFloat(result.text);

	// TODO: instead of returning a bool, render a new page to select items and add to order
	if (distance <= config.site.deliveryDistance) {
		return this.body = true;
	}
	return this.body = false;
};
