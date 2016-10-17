/**
 * New node file
 */
var home = angular.module("home", [ "ngRoute" ]);
home.config(function($routeProvider) {
	// $locationProvider.html5Mode(true)
	$routeProvider.when("/sell", {
		templateUrl : "templates/sell.html",
		controller : "sellCtrl"
	}).when("/profile", {
		templateUrl : "templates/profile.html",
		controller : "profileCtrl"
	}).when("/cart", {
		templateUrl : "templates/cart.html",
		controller : "cartCtrl"
	}).when("/payment", {
		templateUrl : "templates/payment.html",
		controller : "cartCtrl"
	}).when("/sales", {
		templateUrl : "templates/salesHistory.html",
		controller : "salesCtrl"
	}).when("/purchases", {
		templateUrl : "templates/purchaseHistory.html",
		controller : "purchaseCtrl"
	}).otherwise({
		templateUrl : "templates/buy.html",
		controller : "buyCtrl"
	});
});

home.controller("homeCtrl", function($scope) {

});

home.controller("salesCtrl", function($scope, $http) {

	$scope.recordsFound = true;
	// fetch records
	$http({
		method : "GET",
		url : '/getSales'

	}).success(
			function(data) {

				if (data.statusCode == 401) {
					$scope.recordsFound = false;

				} else {
					$scope.recordsFound = true;
					$scope.records = data.data;
					console.log("Got Sales Records", $scope.records);
					$scope.total = 0;
					for (var i = 0; i < $scope.records.length; i++) {
						$scope.total += $scope.records[i].price
								* $scope.records[i].qtySold;
					}
				}

			}).error(function(error) {
		//
	});

});

home.controller("purchaseCtrl", function($scope, $http) {

	$scope.recordsFound = true;
	// fetch records
	$http({
		method : "GET",
		url : '/getPurchases'

	}).success(
			function(data) {

				if (data.statusCode == 401) {
					$scope.recordsFound = false;

				} else {
					$scope.recordsFound = true;
					$scope.records = data.data;
					$scope.total = 0;
					for (var i = 0; i < $scope.records.length; i++) {
						$scope.total += $scope.records[i].productPrice
								* $scope.records[i].totalQty;
					}
				}

			}).error(function(error) {
		//
	});

});

home.controller("buyCtrl", function($scope, $http) {

	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.loadFailMsg = true;
	// fetch products
	$http({
		method : "GET",
		url : '/getProducts'

	}).success(function(data) {

		if (data.statusCode == 401) {
			$scope.loadFailMsg = false;

		} else {
			console.log("Got Products at Angular", data);
			$scope.loadFailMsg = true;
			$scope.products = data.data;
		}

	}).error(function(error) {
		$scope.loadFailMsg = false;
	});

	$scope.addToCart = function(product) {

		$scope.addedProduct = product;

		$http({
			method : "POST",
			url : '/createOrder',
			data : {
				"cartItem" : product
			}
		}).success(function(data) {
			$scope.successMsg = false;
			$scope.failureMsg = true;

		}).error(function(error) {
			$scope.successMsg = true;
			$scope.failureMsg = false;
		});

	};

	$scope.placeBid = function(productId, bidAmount) {

		$http({
			method : "POST",
			url : '/placeBid',
			data : {
				"productId" : productId,
				"bidAmount" : bidAmount
			}
		}).success(function(data) {
			// show success
		}).error(function(error) {
			// show failure
		});

	};

});

home.controller("sellCtrl", function($scope, $http) {
	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.isBiddable = 0;

	$scope.setQty = function(isBiddable) {
		if (isBiddable) {
			$scope.qty = isBiddable;
		}
	}

	$scope.submit = function() {

		console.log("List it clicked")

		$http({
			method : "POST",
			url : '/createListing',
			data : {
				"name" : $scope.name,
				"desc" : $scope.desc,
				"sellerInfo" : $scope.sellerInfo,
				"price" : $scope.price,
				"qty" : $scope.qty,
				"isBiddable" : $scope.isBiddable
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;
				$scope.successMsg = true;
			} else {
				console.log("Update Success");
				$scope.failureMsg = true;
				$scope.successMsg = false;
				// clearing form input post submission
				var form = document.getElementsByName('listing-form')[0];
				form.reset();
			}

		}).error(function(error) {
			$scope.failureMsg = false;
			$scope.successMsg = true;

		});

	};

});

// profile is DONE!
home.controller("profileCtrl", function($scope, $http) {

	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.disabled = true;
	// fetch user profile
	$http({
		method : "GET",
		url : '/getProfile'

	}).success(function(data) {

		if (data.statusCode == 401) {
			// TODO: error handling

		} else {
			console.log("Got Profile at Angular");

			$scope.email = data.data.email;
			$scope.password = data.data.password;
			$scope.firstName = data.data.firstname;
			$scope.lastName = data.data.lastname;
			$scope.about = data.data.about;
			$scope.dob = new Date(data.data.dob);
			$scope.contact = data.data.contact;
			$scope.address = data.data.address;
		}

	}).error(function(error) {
		//
	});

	$scope.update = function() {

		$http({
			method : "POST",
			url : '/updateProfile',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName,
				"about" : $scope.about,
				"dob" : $scope.dob,
				"contact" : $scope.contact,
				"address" : $scope.address
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;

			} else {
				$scope.successMsg = false;
				$scope.disabled = true;
			}

		}).error(function(error) {
			$scope.failureMsg = false;
		});

	};

	$scope.edit = function() {
		$scope.disabled = false;
		$scope.successMsg = true;
		$scope.failureMsg = true;
	};

});

home.controller("cartCtrl", function($scope, $http) {

	$scope.failureMsg = true;
	$scope.total = 0;
	// fetch user profile
	$http({
		method : "GET",
		url : '/getCart'

	}).success(
			function(data) {
				if (data.statusCode == 401) {
					// TODO: error handling

				} else {
					console.log("Got Cart at Angular", data);
					$scope.cart = data.data;

					for (var i = 0; i < $scope.cart.length; i++) {
						$scope.total += $scope.cart[i].productPrice
								* $scope.cart[i].qty;
					}

				}

			}).error(function(error) {
		// 
	});

	$scope.updateTotal = function() {
		var newTotal = 0;
		for (var i = 0; i < $scope.cart.length; i++) {
			newTotal += $scope.cart[i].productPrice * $scope.cart[i].qty;
		}
		$scope.total = newTotal;
	};

	$scope.removeCartItem = function(product) {
		// update db
		$http({
			method : "POST",
			url : '/removeCartItem',
			data : {
				"productId" : product.productId
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;

			} else {
				$scope.failureMsg = true;
				$scope.cart.splice($scope.cart.indexOf(product), 1);
			}

		}).error(function(error) {
			// 
		});

	};// end of removeCartItem

	$scope.updateCartItem = function(product) {

		// update db
		$http({
			method : "POST",
			url : '/updateCartItem',
			data : {
				"productId" : product.productId,
				"qty" : product.qty
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				console.log("cart Item NOT Updated");
			} else {
				console.log("cart Item Updated");
			}

		}).error(function(error) {
			// TODO: error handling
		});

	};

	// TODO: optimize
	$scope.makePayment = function() {

		$http({
			method : "POST",
			url : '/makePayment',
			data : {
				"cardNum" : $scope.cardNum,
				"cardCVV" : $scope.cardCVV
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				// show card invalid
				console.log("Card INVALID at angular");

			} else {
				// card valid
				console.log("Card valid at angular");
				// update db
				$http({
					method : "POST",
					url : '/placeOrder',
					data : {
						"cart" : $scope.cart
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.statusCode == 401) {
						// show error

					} else {
						// do re-direction to home
						window.location.assign("/home");
					}

				}).error(function(error) {
					// 
				});

			}

		}).error(function(error) {
			//
		});

	};

});
