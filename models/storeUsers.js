"use strict";

const Chance = require("chance");
const chance = new Chance();

module.exports = {
	newUser: (username, password, level) => {
		const user = {
			id: chance.hammertime(),
			username: username,
			password: password
		};
	}
};
