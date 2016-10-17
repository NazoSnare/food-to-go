"use strict";

const config = require("../config.json");

let user = null;

module.exports.success = function* success() {
	if (this.isAuthenticated()) {
		user = this.session.passport.user;
	}
	yield this.body = {error: false, user_id: user.id, username: user.username};
};

module.exports.failure = function* failure() {
	yield this.body = {error: true, message: "Sorry, something has gone awfully wrong! please try to login again"};
};
