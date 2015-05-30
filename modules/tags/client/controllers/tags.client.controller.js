'use strict';
/* global _: false */

angular.module('tags').controller('TagsController',
    function($scope, $window, $state, Authentication, Tags) {
        $scope.authentication = Authentication;

        //allows admin to request tags data from database
        $scope.find = function() {
            if ($scope.authentication.user.roles[0] === 'user') {
                $state.go('main');
            } else {
                $scope.tags = Tags.query();
            }
        };

        //creates a new tag
        $scope.create = function() {
            if ($scope.tag.name) {
                var tag = new Tags($scope.tag);
                tag.$save(function(response) {
                    $scope.tag = null;
                    $scope.tags.push(response);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        //deletes the selected tag
        $scope.removeTag = function(selected) {
            var confirmation = $window.prompt('Type DELETE to remove the ' + selected.name + ' ' + selected.type);
            if (confirmation) {
                selected.$remove(function() {
                    var oldTagIndex = _.findIndex($scope.tags, selected);
                    $scope.tags.splice(oldTagIndex, 1);
                });
            }
        };



    }
);