'use strict';

angular.module('tags').controller('TagsController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Authentication', 'Tags',
	function($scope, $rootScope, $state, $stateParams, $location, Authentication, Tags) {
		$scope.authentication = Authentication;

		function isUnauthorized() {
			return $scope.authentication.user.roles[0] === 'user';
		}

		$scope.departments = ['General', 'Academic Programs', 'Admissions', 'Counseling', 'Executive Office', 'External Affairs', 'Finance and Administration', 'Leadership Development Opportunities', 'Smart Connections', 'Undergraduate Affairs'];

		$scope.isNewPage = function() {
			return $location.path() === '/tags/create';
		};

		$scope.isEditing = function() {
			return $location.path().indexOf('edit') >= 0;
		};

		$scope.create = function() {
			var tag = new Tags($scope.tag);
			tag.$save(function(response) {
				$scope.tag = null;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.save = function() {
			if ($location.path() === '/tags/create') {
				$scope.create();
			}
			else {
				$scope.update();
			}
		};

		$scope.removeTag = function(selected) {
			console.log(selected);
			selected.$remove(function() {
				console.log('tag removed');
			});
		};

		$scope.update = function() {
			var tag = $scope.tag;

			tag.$update(function() {
				$location.path('tags/' + tag._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			if (isUnauthorized()) {
				$state.go('main');
			} else {
				$scope.tags = Tags.query();
			}
		};

	}
]);
