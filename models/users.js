"use strict";

const Chance = require("chance");
const db = require("../helpers/db");
const bcrypt = require("bcrypt");
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

	getUser: function getUser(username, password, test = false) {
		let document;
		if (test === true) {
			document = viewData;
		} else {
			document = db.getDocument(username, "ftgusers");
		}
		const passwordMatch = comparePassword(password, document);
		if (!passwordMatch) {
			return {error: true, message: "You must provide valid credentials"};
		}
		return document;
	}
};

function encryptPassword(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

function comparePassword(password, doc) {
	return bcrypt.compareSync(password, doc.password);
};
