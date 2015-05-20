'use strict';

/**
 * Module dependencies.
 */
var tags = require('../controllers/tags.server.controller');

module.exports = function(app) {
	// Articles collection routes
	app.route('/api/tags')
		.get(tags.list)
		.post(tags.create);

	// Single article routes
	app.route('/api/tags/:tagId')
		.get(tags.read)
		.put(tags.update)
		.delete(tags.delete);

	// Finish by binding the tag middleware
	app.param('tagId', tags.tagByID);
};
