"use strict";

const Chance = require("chance");
const chance = new Chance();

module.exports = {
	newUser: (username, password, level) => {
		const user = {
			id: chance.hammertime(),
			username: username,
			password: password,
			// is this an account for the store or consumers?
			storeAccount: false
		};
	}
};
