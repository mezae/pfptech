'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('tags').factory('Tags', ['$resource',
	function($resource) {
		return $resource('api/tags/:tagId', {
			tagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
