'use strict';
/* global _: false */

angular.module('articles').controller('ArticlesController', ['$scope', '$state', 'Authentication', 'Articles', 'Tags',
	function($scope, $state, Authentication, Articles, Tags) {

		$scope.departments = ['General', 'Academic Programs', 'Admissions', 'Counseling',
			'Executive Office', 'External Affairs', 'Finance and Administration',
			'Leadership Development Opportunities', 'Smart Connections', 'Undergraduate Affairs'];

		$scope.find = function() {
			if (Authentication.user) {
				Articles.query(function(articles) {
					$scope.articles = _.groupBy(articles, 'department');
					$scope.tags = Tags.query();
				});
			} else {
				$state.go('home');
			}
		};
	}
]);
