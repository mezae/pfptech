'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tag Schema
 */
var TagSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'tag name cannot be blank'
	},
	type: {
		type: String,
		default: '',
		enum: ['tag', 'subtag']
	}
});

mongoose.model('Tag', TagSchema);
