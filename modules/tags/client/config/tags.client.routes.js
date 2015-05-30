'use strict';

// Setting up route
angular.module('tags').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
        state('tags', {
            abstract: true,
            url: '/tags',
            template: '<ui-view/>'
        }).
        state('tags.list', {
            url: '',
            templateUrl: 'modules/tags/views/list-tags.client.view.html'
        });
    }
]);