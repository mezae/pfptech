'use strict';

angular.module('articles').controller('SidebarController', ['$scope', '$rootScope', '$window', '$state', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $rootScope, $window, $state, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$rootScope.$on('$stateChangeSuccess', function() {
			$scope.editing = $state.current.name === 'articles.create' || $state.current.name === 'articles.edit';
		});

		$scope.$on('pageJump', function () {
			$scope.editing = false;
		});

		$scope.redirect = function(page) {
			if ($state.current.name === 'articles.create' || $state.current.name === 'articles.edit') {
				var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
				if (confirmation) {
					$scope.editing = false;
					$state.go(page);
				}
			}
			else {
				$state.go(page);
			}
		};

		$scope.user = function() {
			return $scope.authentication.user;
		};

		$scope.isAdmin = function() {
			if ($scope.authentication.user) {
				return $scope.authentication.user.roles[0] === 'admin';
			}
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
			$scope.$on('$stateChangeSuccess', function() {
				$scope.editing = false;
			});
		};

		$scope.cancel = function() {
			if ($scope.isActive('/articles/create')) {
				$state.go('main');
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
