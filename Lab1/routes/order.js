/**
 * New node file
 */
var mysql = require('./mysql');
var logger = require('./logger');

// working!
exports.createOrder = function(req, res) {

	var cartItem = req.param("cartItem");

	logger.info("USER ID: " + req.session.userId
			+ "  ADDED ITEM with PRODUCT ID: " + cartItem.productId
			+ " to the CART");

	var checkOrder = "select * from orders where buyerId = "
			+ req.session.userId + " and productId =" + cartItem.productId
			+ " and isPaidFor= " + 0;

	mysql
			.fetchData(
					function(err, results) {

						if (err) {
							throw err;
						} else {
							var json_response;

							if (results.length > 0) {

								var updateCart = "update orders set qty = qty + 1 where buyerId = "
										+ req.session.userId
										+ " and productId ="
										+ cartItem.productId
										+ " and isPaidFor= " + 0;

								mysql.fetchData(function(err, results) {

									if (err) {
										throw err;
									} else {
										var json_response;

										if (results.affectedRows > 0) {

											json_response = {
												"statusCode" : 200
											};
											res.send(json_response);

										} else {

											json_response = {
												"statusCode" : 401
											};
											res.send(json_response);
										}
									}
								}, updateCart);

							} else {

								var createOrder = "insert into orders (buyerId, productId, productName, productDesc, sellerInfo, inStockQty, productPrice) values ("
										+ req.session.userId
										+ ", "
										+ cartItem.productId
										+ ", '"
										+ cartItem.name
										+ "', '"
										+ cartItem.description
										+ "', '"
										+ cartItem.sellerInfo
										+ "', "
										+ cartItem.qty
										+ ", "
										+ cartItem.price
										+ ")";

								console.log("Query is:" + createOrder);

								mysql.fetchData(function(err, results) {

									if (err) {
										throw err;
									} else {
										var json_response;

										if (results.affectedRows > 0) {

											json_response = {
												"statusCode" : 200
											};
											res.send(json_response);

										} else {

											json_response = {
												"statusCode" : 401
											};
											res.send(json_response);
										}
									}
								}, createOrder);

							}// else close

						}// else error

					}, checkOrder);

};

// working!
exports.getCart = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED CART ITEMS");

	var getCart = "select * from orders where buyerId = " + req.session.userId
			+ " and isPaidFor = " + 0;

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.length > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, getCart);

};

// working!
exports.placeOrder = function(req, res) {

	logger.info("USER ID: " + req.session.userId + "  PLACED an ORDER");

	var cart = req.param("cart");

	for (var i = 0; i < cart.length; i++) {

		var updateQty = "update products set qty = qty -" + cart[i].qty
				+ " where productId = " + cart[i].productId;

		mysql.fetchData(function(err, results) {

			if (err) {
				throw err;

			} else {
				var json_response;

				if (results.affectedRows > 0) {

					console.log("Quantity updated");

				} else {

					console.log("Quantity NOT updated");
				}
			}
		}, updateQty);

	}

	var placeOrder = "update orders set isPaidFor = " + 1 + " where buyerId = "
			+ req.session.userId + " and isPaidFor= " + 0;

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.affectedRows > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, placeOrder);

};

// working!
exports.updateCartItem = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried UPDATING an ITEM  with PRODUCT ID: "
			+ req.param("productId") + " from the CART");

	var updateCartItem = "update orders set qty = " + req.param("qty")
			+ " where buyerId = " + req.session.userId + " and productId ="
			+ req.param("productId") + " and isPaidFor= " + 0;

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.affectedRows > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, updateCartItem);

};

// working!
exports.removeCartItem = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried REMOVING an ITEM  with PRODUCT ID: "
			+ req.param("productId") + " from the CART");

	var removeOrder = "delete from orders where buyerId =" + req.session.userId
			+ " and productId = " + req.param("productId") + " and isPaidFor ="
			+ 0;

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.affectedRows > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, removeOrder);

}
