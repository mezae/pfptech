'use strict';

angular.module('articles').controller('ArticleController', ['$scope', '$rootScope', '$window', '$stateParams', '$location', 'Authentication', 'Articles', 'Tags', '$sce',
	function($scope, $rootScope, $window, $stateParams, $location, Authentication, Articles, Tags, $sce) {
		$scope.authentication = Authentication;

		$scope.departments = ['General', 'Academic Programs', 'Admissions', 'Counseling', 'Executive Office', 'External Affairs', 'Finance and Administration', 'Leadership Development Opportunities', 'Smart Connections', 'Undergraduate Affairs'];

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
			if(this.articleTags.$valid) {
				var article = new Articles($scope.article);
				article.$save(function(response) {
					$scope.article = response;
					$location.path('articles/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			} else {
				alert('Please tag this article.');
			}
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
			var confirmation = $window.prompt('Type DELETE to remove this article forever.');
			if (confirmation === 'DELETE') {
				var article = $scope.article;
				article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.findOne = function() {
			$scope.tags = Tags.query();
			$scope.newtag = {name: '', type: ''};
			$scope.editorOptions = {
		    language: 'en',
		    uiColor: '#FFFFFF'
			};
			if($stateParams.articleId) {
				$scope.article = Articles.get({
					articleId: $stateParams.articleId
				});
				$scope.safecontent = $sce.trustAsHtml($scope.article.content);
			}
			else{
				$scope.article = {
					title: 'title',
					content: 'content',
					tag: ''
				};
			}
		};

		$scope.createTag = function(type) {
			$scope.newtag.type = type;
			var tag = new Tags($scope.newtag);
			tag.$save(function(response) {
				$scope.tags.push(response);
				$scope.newtag = null;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);
