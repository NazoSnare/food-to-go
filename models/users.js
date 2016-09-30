"use strict";

const Chance = require("chance");
const chance = new Chance();
const db = require("../helpers/db");

module.exports = {
	newUser: (username, password, level) => {
		const user = {
			error: false,
			id: chance.guid(),
			username: username,
			password: password,
			// is this an account for the store or consumers?
			storeAccount: false,
			authLevel: level
		};
		return user;
	},

	getUser: function* getUser(username) {
		const document = yield db.checkUser(username);
		return document;
	}
};
