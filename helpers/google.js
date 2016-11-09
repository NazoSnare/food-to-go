"use strict";

const config = require("../config.json");
const gmaps = require("@google/maps");

const client = gmaps.createClient({
	key: config.plugins.google.apiKey,
	Promise: Promise
});

module.exports.geocode = function* geocode(address) {
	const result = yield client.geocode({
		address: address
	}).asPromise().then((response) =>  {
		return response.json.results;
	}).catch((err) => {
		console.log(err);
	});

	return result;
};

module.exports.matrix = function* matrix(address) {
	const result = yield client.distanceMatrix({
		origins: [ address ],
		destinations: [ config.site.address ],
		mode: "driving",
		units: "imperial"
	}).asPromise().then((response) => {
		return response.json.rows[0].elements[0].distance;
	}).catch((err) => {
		console.log(err);
	});

	return result;
};
