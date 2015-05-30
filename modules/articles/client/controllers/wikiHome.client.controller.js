'use strict';

angular.module('articles').controller('WikiHomeController', ['$scope', '$state', 'Authentication', 'Articles', '$sce',
    function($scope, $state, Authentication, Articles, $sce) {
        $scope.authentication = Authentication;

        //when user clicks the check mark on sidebar
        $scope.$on('clickedSave', function() {
            $scope.save();
        });

        //helps browser know what to show as user jumps to/from editing mode
        $scope.$on('$stateChangeSuccess', function() {
            $scope.editing = $state.current.name === 'main.edit';
        });


        //request wikiHome article from database
        $scope.findHome = function() {
            Articles.get({
                articleId: 'Home'
            }, function(post) {
                $scope.article = post;
                $scope.safecontent = $sce.trustAsHtml($scope.article.content);
                $scope.editorOptions = {
                    language: 'en',
                    uiColor: '#FFFFFF'
                };
            });
        };

        //allows admin to update the content on the wikiHome page
        $scope.save = function() {
            var article = $scope.article;
            article.$update(function() {
                $state.go('main', {}, {
                    reload: false,
                    notify: true
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);