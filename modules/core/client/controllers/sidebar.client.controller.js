'use strict';

angular.module('articles').controller('SidebarController', ['$scope', '$rootScope', '$window', '$state', '$stateParams', '$location', 'Authentication', 'Articles',
    function($scope, $rootScope, $window, $state, $stateParams, $location, Authentication, Articles) {
        $scope.authentication = Authentication;

        //helps browser know what to show as user jumps to/from editing mode
        $scope.$on('$stateChangeSuccess', function() {
            $scope.editing = ['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1;
        });

        //redirect user to new page, but only after making sure that user has saved his/her work
        $scope.redirect = function(page) {
            if (['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1) {
                var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
                if (confirmation) {
                    $state.go(page);
                }
            } else {
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
            return $state.current.name === page;
        };

        $scope.edit = function() {
            if ($state.current.name === 'main') {
                $state.go('main.edit', {}, {
                    reload: false,
                    notify: true
                });
            } else {
                $state.go('articles.edit', {
                    articleId: $stateParams.articleId
                }, {
                    reload: false,
                    notify: true
                });
            }
        };

        $scope.save = function() {
            $rootScope.$broadcast('clickedSave');
        };

        $scope.cancel = function() {
            if (['main.edit', 'articles.create'].indexOf($state.current.name) > -1) {
                $state.go('main');
            } else {
                $state.go('articles.view', {
                    articleId: $stateParams.articleId
                }, {
                    reload: false,
                    notify: true
                });
            }
        };

        $scope.remove = function() {
            $rootScope.$broadcast('clickedRemove');
        };

    }
]);