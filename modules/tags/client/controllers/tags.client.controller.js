'use strict';

angular.module('tags').controller('TagsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Tags',
	function($scope, $rootScope, $stateParams, $location, Authentication, Tags) {
		$scope.authentication = Authentication;

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

		$scope.remove = function() {
			var tag = $scope.tag;
			tag.$remove(function() {
				$location.path('tags');
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
			$scope.tags = Tags.query();
		};

		$scope.findOne = function() {
			if($stateParams.tagId) {
				$scope.tag = Tags.get({
					tagId: $stateParams.tagId
				});
			}
			else{
				$scope.tag = {};
			}
		};

	}
]);
