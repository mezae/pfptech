'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $rootScope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.title = 'title';
		$scope.content = 'content';

		$scope.$on('clickedSave', function () {
				$scope.save();
		});

		$scope.$on('clickedRemove', function () {
				$scope.remove();
		});

		$scope.isNewPage = function() {
			return $location.path() === '/articles/create';
		};

		$scope.isEditing = function() {
			return $location.path().indexOf('edit') >= 0;
		};

		$scope.create = function() {
			var article = new Articles({
				title: $scope.title,
				content: $scope.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.save = function() {
			if ($location.path() === '/articles/create') {
				$scope.create();
			}
			else {
				$scope.update();
			}
		};

		$scope.remove = function() {
			var article = $scope.article;
			article.$remove(function() {
				$location.path('articles');
			});
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			if($stateParams.articleId) {
				$scope.article = Articles.get({
					articleId: $stateParams.articleId
				});
			}
			else{
				$scope.article = {
					title: 'title',
					content: 'content'
				}
			}
		};

	}
]);
