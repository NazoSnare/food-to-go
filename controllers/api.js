"use strict";

const config = require("../config.json");
const stripe = require("../index.js").stripe;
const parse = require("co-body");
const db = require("../helpers/db");
const orderModel = require("../models/order");
const itemModel = require("../models/item");

let pid;

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
		console.log(params);
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

	const result = yield orderModel.addCustInfo(order, params.customerName, params.customerAddress, params.customerPhone);
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

module.exports.payment = function* payment()
{
	const params = this.request.body;
	let data;

	if (!params.stripeToken) {
		this.throw(400, "Sorry, something has gone awry.");
	}
	if (!params.amount) {
		this.throw(400, "A purchase amount must be supplied.");
	}
	const chargeAmount = params.amount * 100;

	const charge = stripe.charges.create({
		amount: (params.amount * 100),
		currency: "USD",
		source: params.stripeToken,
		description: `${config.site.name} order#: ${this.session.id}`
	}, (err, charge) => {
		data = charge.id;
	});

	yield this.render("payment/payment_success", {
		id: data
	});
};


module.exports.success = function* success() {
	this.session.pid = pid;
	if (this.session.pid !== undefined) {
		yield this.render("payment/payment_success", {
			id: this.session.pid
		});
	} else {
		this.throw(400, "Something has gone terribly wrong.");
	}
};

function* process() {
	yield this.render("payment/processing", {
		script: "payment/processing"
	});
}
