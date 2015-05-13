'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$state', '$window' , 'Authentication', 'Menus',
    function($rootScope, $scope, $state, $window, Authentication, Menus) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;
        $scope.user = function() {
            return $scope.authentication.user;
        };

        $scope.redirect = function(page) {
          if ($state.current.name === 'articles.create') {
            var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
            if (confirmation) {
              $rootScope.$broadcast('pageJump');
              $state.go(page);
            }
          }
          else {
            $state.go(page);
          }
        };

        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);
