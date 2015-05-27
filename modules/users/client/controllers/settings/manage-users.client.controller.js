'use strict';

angular.module('users').controller('ManageUsersController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

    $scope.findUsers = function() {
      $http.get('/api/users/index').success(function(response) {
        $scope.staff = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
    };

    $scope.saveProfile = function() {
      if (!$scope.newUser._id) {
        $scope.signup();
      } else {
        $scope.updateUserProfile();
      }
    };

    $scope.signup = function() {
			$http.post('/api/auth/signup', $scope.newUser).success(function(response) {
        $scope.staff.push(response);
        $scope.newUser = null;
        $scope.addNewUser = false;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

    $scope.editUser = function(user, index) {
      $scope.newUser = user;
      $scope.userIndex = index;
      $scope.addNewUser = true;
    };

    $scope.cancel = function() {
      $scope.newUser = null;
      $scope.userIndex = null;
      $scope.addNewUser = false;
    };

		// Update a user profile
		$scope.updateUserProfile = function() {
				$scope.error = null;
				var user = new Users($scope.newUser);

				user.$update(function(response) {
          $scope.staff.splice($scope.userIndex, 1);
          $scope.staff.push(response);
					$scope.addNewUser = false;
				}, function(response) {
					$scope.error = response.data.message;
				});
		};
	}
]);
