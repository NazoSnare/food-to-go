"use strict";

const config = require("../config.json");
const parse = require("co-body");
const db = require("../helpers/db");
const itemModel = require("../models/item");
const catModel = require("../models/categories");

// Below are the GET routes for the store end

// Show the store view
module.exports.store = function* store() {
	yield this.render("store/store", {
		title: config.site.name,
		script: "store/store"
	});
};

// Show the add item view
module.exports.add = function* add() {
	yield this.render("store/add", {
		title: config.site.name,
		script: "store/addItem"
	});
};

// Below are the POST routes for the store end

// Get all the orders from the db and show to the store
module.exports.getOrders = function* getOrders() {
	const order = yield db.getAllOrders();
	if (order.error === true) {
		this.status = 400;
		return this.body = {error: true, message: order.message};
	}
	return this.body = order;
};

// Make and new item and add it to the database
module.exports.newItem = function* newItem() {
	const params = this.request.body;
	if (!params.name && params.cat && params.desc && params.price) {
		this.status = 400;
		return this.body = {error: true, message: "Must include all variables (name, category, description, and price)"};
	}

	const item = itemModel.newItem(params.name, params.cat, params.desc, params.price);
	if (item.error === true) {
		this.status = 400;
		return this.body = {error: true, message: item.message};
	}

	const result = yield db.saveDocument(item, "items");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}
	return this.body = result;
};

module.exports.newCategory = function* newCategory(id) {
	const params = this.request.body;
	if (!params.id) {
		this.status = 400;
		return this.body = {error: true, message: "Must include an order id."};
	}

	const category = catModel.newCategory(params.id);
	if (category.error === true) {
		this.status = 400;
		return this.body = {error: true, message: category.message};
	}

	const result = yield db.saveDocument(id, "categories");
	if (result.error === true) {
		this.status = 400;
		return this.body = {error: true, message: result.message};
	}
	return this.body = result;
};

module.exports.getCategory = function* getCategory(id) {

	const category = yield db.getDocument(id, "categories");
	if (category.error === true) {
		this.status = 400;
		return this.body = {error: true, message: category.message};
	}
	return this.body = item;
};
