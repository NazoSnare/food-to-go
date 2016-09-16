"use strict";

const Chance = require("chance");
const chance = new Chance();

module.exports = {
	newUser: (username, password, level) => {
		const user = {
			error: false,
			id: chance.guid(),
			username: username,
			password: password,
			// is this an account for the store or consumers?
			storeAccount: false,
			authLevel: 0
		};
		return user;
	}
};
