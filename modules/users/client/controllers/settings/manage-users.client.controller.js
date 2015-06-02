'use strict';

angular.module('users').controller('ManageUsersController', ['$scope', '$http', '$window', 'Users', 'Authentication',
	function($scope, $http, $window, Users, Authentication) {
		$scope.user = Authentication.user;

		//requests all user data from database
    $scope.findUsers = function() {
      Users.query(function(response) {
        $scope.staff = response;
			});
    };

		//checks whether data is for new or existing user before saving
    $scope.saveProfile = function() {
      if (!$scope.newUser._id) {
        $scope.signup();
      } else {
        $scope.updateUserProfile();
      }
    };

		//creates new user
    $scope.signup = function() {
			$http.post('/api/auth/signup', $scope.newUser).success(function(response) {
        $scope.staff.push(response);
        $scope.newUser = null;
        $scope.addNewUser = false;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//allows admin users to edit any existing user
    $scope.editUser = function(user, index) {
			if ($scope.user.roles[0] === 'admin') {
	      $scope.newUser = user;
	      $scope.userIndex = index;
	      $scope.addNewUser = true;
			}
    };

		//hides and resets editing form
    $scope.cancel = function() {
      $scope.newUser = $scope.userIndex = null;
      $scope.addNewUser = false;
    };

		//updates an existing user
		$scope.updateUserProfile = function() {
				$scope.error = null;
				var user = new Users($scope.newUser);
				user.$update(function(response) {
          $scope.staff.splice($scope.userIndex, 1);
          $scope.staff.push(response);
					$scope.cancel();
				}, function(response) {
					$scope.error = response.data.message;
				});
		};

		//deletes selected user
		$scope.removeUser = function() {
			var confirmation = $window.prompt('Type DELETE to remove ' + $scope.newUser.displayName + '\'s account.');
			if (confirmation === 'DELETE') {
				var user = new Users($scope.newUser);
				user.$remove(function() {
					$scope.staff.splice($scope.userIndex, 1);
					$scope.addNewUser = false;
				}, function(response) {
					$scope.error = response.data.message;
				});
			}
		};
	}
]);
