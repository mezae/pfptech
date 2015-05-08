'use strict';

angular.module('articles').controller('SidebarController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $rootScope, $state, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.user = function() {
			return $scope.authentication.user;
		};

		$scope.isAdmin = function() {
			return $scope.authentication.user.roles === ['admin'];
		};

		$scope.isActive = function(page) {
			return $location.path() === page;
		};

		$scope.create = function()  {
			$state.go('articles.create');
			$scope.editing = true;
		};

		$scope.edit = function() {
			$state.go('articles.edit', { articleId: $stateParams.articleId }, { notify: false });
			$scope.editing = true;
		};

		$scope.save = function() {
			$rootScope.$broadcast('clickedSave');
			$scope.editing = false;
		};

		$scope.cancel = function() {
			if ($scope.isActive('/articles/create')) {
				$location.path('/wikiHome');
			}
			else {
				$state.go('articles.view', { articleId: $stateParams.articleId }, { notify: false });
			}
			$scope.editing = false;
		};

		$scope.remove = function()  {
			$rootScope.$broadcast('clickedRemove');
			$scope.editing = false;
		};

	}
]);