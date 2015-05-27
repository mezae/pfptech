'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

exports.index = function(req, res) {
	User.find({}, 'username firstName lastName displayName email roles').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.user);
};

/**
 * Update user details
 */
exports.update = function (req, res) {
	console.log(req.user);
	console.log(req.body);
	if (req.user) {
		User.findById(req.body._id).exec(function(err, profile) {
			var user = profile;

			console.log(user);
			// Merge existing user
			user = _.extend(user, req.body);
			user.updated = Date.now();
			user.displayName = user.firstName + ' ' + user.lastName;

			user.save(function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					if(req.user.username === user.username) {
						req.login(user, function (err) {
							if (err) {
								res.status(400).send(err);
							} else {
								res.json(user);
							}
						});
					} else {
						res.json(user);
					}
				}
			});
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
	var user = req.user;
	var message = null;

	if (user) {
		fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading profile picture'
				});
			} else {
				user.profileImageURL = 'modules/users/img/profile/uploads/' + req.files.file.name;

				user.save(function (saveError) {
					if (saveError) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(saveError)
						});
					} else {
						req.login(user, function (err) {
							if (err) {
								res.status(400).send(err);
							} else {
								res.json(user);
							}
						});
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};
