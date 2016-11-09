"use strict";

const config = require("../config.json");
const stripe = require("stripe")(config.plugins.stripe.secret_key);

module.exports.charge = function* charge(token, total) {
	const charge = yield stripe.charges.create({
		amount: total,
		currency: "USD",
		source: token,
		description: `${config.site.name} order#: ${this.session.id}`
	});
	return charge;
};
