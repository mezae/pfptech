'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Tag = mongoose.model('Tag'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a tag
 */
exports.create = function(req, res) {
	var tag = new Tag(req.body);

	tag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tag);
		}
	});
};

/**
 * Show the current tag
 */
exports.read = function(req, res) {
	res.json(req.tag);
};

/**
 * Update a tag
 */
exports.update = function(req, res) {
	var tag = req.tag;

	tag.tag = req.body.tag;
	tag.subtag = req.body.subtag;

	tag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tag);
		}
	});
};

/**
 * Delete an tag
 */
exports.delete = function(req, res) {
	var tag = req.tag;

	tag.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tag);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Tag.find(req.query, '-__v -created').exec(function(err, tags) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tags);
		}
	});
};

/**
 * Tag middleware
 */
exports.tagByID = function(req, res, next, id) {
	Tag.findById(id).exec(function(err, tag) {
		if (err) return next(err);
		if (!tag) return next(new Error('Failed to load tag ' + id));
		req.tag = tag;
		next();
	});
};
