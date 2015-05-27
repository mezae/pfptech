'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$window' , 'Authentication',
    function($scope, $state, $window, Authentication) {
        $scope.authentication = Authentication;

        $scope.redirect = function(page) {
          if (['main.edit', 'articles.create', 'articles.edit'].indexOf($state.current.name) > -1) {
            var confirmation = $window.confirm('Are you sure you want to leave this page without saving?');
            if (confirmation) {
              $state.go(page);
            }
          }
          else {
            $state.go(page);
          }
        };
    }
]);
