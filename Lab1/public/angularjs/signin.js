var signIn = angular.module('signIn', []);

signIn.controller('signInCtrl', function($scope, $http) {

	$scope.wrongPwd = true;
	$scope.noSuchEmail = true;
	$scope.success = true;

	$scope.signIn = function() {

		console.log("signIn in clicked")

		$http({
			method : "POST",
			url : '/signin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				// TODO: error

			} else {
				console.log("SignIn Success");
				window.location.assign("/home");
			}

		}).error(function(error) {
			// TODO: error handling
		});

	};

	$scope.signUp = function() {

		console.log("signUp in clicked")

		$http({
			method : "POST",
			url : '/signup',
			data : {
				"email" : $scope.newEmail,
				"password" : $scope.newPassword,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName
			}
		}).success(function(data) {
			// checking the response data for statusCode
			if (data.statusCode == 401) {
				// TODO: error

			} else {

				// TODO: success : inform user and redirect to next screen
				$scope.success = false;
				console.log("SignUp Success");
				window.location.assign("/home"); 
			}

		}).error(function(error) {
			// TODO: error handling
		});

	};

})