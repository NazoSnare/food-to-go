"use strict";

const config = require("../config.json");
const parse = require("co-body");
const db = require("../helpers/db");
const itemModel = require("../models/item");
const catModel = require("../models/categories");
const userModel = require("../models/users");

let user;

// Below are the GET routes for the store end
module.exports.storeLogin = function* storeLogin() {
	if (this.isAuthenticated() && this.session.passport.user.store === true) {
		return this.redirect("/store/store");
	}
	yield this.render("store/storeLogin", {
		title: config.site.name,
		script: "store/storeLogin"
	});
};

// Show the store view
module.exports.store = function* store() {
	const orders = yield db.getAllOrders;
	if (this.isAuthenticated() && this.session.passport.user.store === true) {
		user = this.session.passport.user;
		yield this.render("store/store", {
			title: config.site.name,
			orders: orders,
			user: user,
			script: "store/store"
		});
	} else {
		return this.redirect("/");
	}
};

// Show the add item view
module.exports.addItemPage = function* addItemPage() {
	if (this.isAuthenticated() && this.session.passport.user.store === true) {
		yield this.render("store/add", {
			title: config.site.name,
			script: "store/addItem"
		});
	} else {
		return this.redirect("/");
	}
};

module.exports.admin = function* admin() {
	if (this.isAuthenticated() && this.session.passport.user.store === true) {
		yield this.render("store/admin", {
			title: config.site.name,
			script: "store/admin"
		});
	} else {
		return this.redirect("/");
	}
};

// Show the add item view
module.exports.addUserPage = function* addUserPage() {
	if (this.isAuthenticated() && this.session.passport.user.store === true) {
		yield this.render("store/addUser", {
			title: config.site.name,
			script: "store/addUser"
		});
	} else {
		return this.redirect("/");
	}
};

// Below are the POST routes for the store end

// Get all the orders from the db and show to the store
module.exports.addUser = function* addUser() {
	const params = this.request.body;
	if (!params.username) {
		this.throw(400, "You need to provide a username for this user");
	}
	if (!params.password) {
		this.throw(400, "You need to provide a password for this user");
	}
	if (!params.username) {
		this.throw(400, "You need to provide a level for this user");
	}
	const user = yield userModel.newUser(params.username, params.password, params.level);
	if (user.error === true) {
		this.throw(500, "Something has gone awry!");
	}
	return this.body = user;
};

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
