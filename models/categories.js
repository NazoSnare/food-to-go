"use strict";

/**
* newCategory
* Creates a new category object and returns it
*
* @param {string} name - name of the category
* @returns {object} category -  The full category object
*/
module.exports = {
	newCategory: (name) => {
		const category = {
			error: false,
			id: name
		};
		return category;
	}
};
