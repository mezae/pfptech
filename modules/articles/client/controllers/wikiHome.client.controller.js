'use strict';

angular.module('articles').controller('WikiHomeController', ['$scope', '$state', 'Authentication', 'Articles', '$sce',
	function($scope, $state, Authentication, Articles, $sce) {
		$scope.authentication = Authentication;

		$scope.$on('clickedSave', function () {
				$scope.save();
		});

		$scope.$on('$stateChangeSuccess', function() {
			$scope.editing = $state.current.name === 'main.edit';
		});

    $scope.findHome = function() {
			$scope.editorOptions = {
		    language: 'en',
		    uiColor: '#FFFFFF'
			};
			$scope.article = Articles.get({
				articleId: 'Home'
			});
			$scope.safecontent = $sce.trustAsHtml($scope.article.content);
		};

		$scope.save = function() {
			var article = $scope.article;
			article.$update(function() {
				$state.go('main', {}, { reload: false, notify: true });
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);
