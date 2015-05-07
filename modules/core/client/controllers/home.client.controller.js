'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Articles',
    function($scope, $http, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
    }
]);
