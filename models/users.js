"use strict";

const Chance = require("chance");
const db = require("../helpers/db");
const bcrypt = require("bcryptjs");
const viewData = require("../tests/mockData/usersdb.json");

module.exports = {
	newUser: (username, password, level) => {
		const encrypted = encryptPassword(password);
		const user = {
			error: false,
			id: username,
			username: username,
			password: encrypted,
			// is this an account for the store or consumers?
			storeAccount: false,
			authLevel: level
		};
		return user;
	},

	getUser: function* getUser(username, password, test = false) {
		/* istanbul ignore next */
		let document;
		/* istanbul ignore next */
		if (test === true) {
			document = viewData;
		} else {
			document = yield db.getDocument(username, "ftgusers");
		}
		/* istanbul ignore next */
		const passwordMatch = comparePassword(password, document);
		/* istanbul ignore next */
		if (!passwordMatch) {
			return {error: true, message: "You must provide valid credentials"};
		}
		/* istanbul ignore next */
		return document;
	}
};

function encryptPassword(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

function comparePassword(password, doc) {
	/* istanbul ignore next */
	return bcrypt.compareSync(password, doc.password);
};
