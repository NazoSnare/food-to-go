"use strict";
/**
 * Order Model
 * In charge of all things dealing with the orders
 *
 */

const Chance = require("chance");
const chance = new Chance();

module.exports = {
	/**
	* newOrder
	* Creates a new order object and returns it
	*
	* @returns {object} order -  The full order object
	*/

	newOrder: () => {
		const order = {
			error: false,
			id: chance.guid(),
			dateTime: new Date(),
			status: "preparing",
			state: "in-progress",
			location: "store#",
			method: "delivery",
			customerName: "name",
			customerAddress: "address",
			customerPhone: "123-456-7890",
			items: [],
			paymentID: "0000"
		};

		return order;
	},

	/**
	* addCustInfo
	* Attempts to add customer info
	*
	* @param {string} order - The full order object
	* @param {string} name - name of customer
	* @param {string} address - full address of customer
	* @param {string} phone - phone number of customer
	* @returns {object} order -  The full order object
	*/

	addCustInfo: (order, name, address, phone) => {
		order.customerName = name;
		order.customerAddress = address;
		order.customerPhone = phone;
		return order;
	},

	/**
	* addItem
	* Attempts to add an item to the order
	*
	* @param {string} order - The full order object
	* @param {array} item - The item being added
	* @returns {object} order -  The full order object
	*/
	addItem: (order, item) => {
		order.items.push(item);
		return order;
	},

	/**
	* addPaymentID
	* Attempts to add the payment ID to the order
	*
	* @param {string} order - The full order object
	* @param {string} id - The id of the payment transaction
	* @returns {object} order -  The full order object
	*/
	addPaymentID: (order, id) => {
		// add the id here
		order.paymentID = id;
		return order;
	}

};
