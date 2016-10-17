/**
 * New node file
 */
var mysql = require("./mysql");
var logger = require("./logger");

// working!
exports.getPurchases = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED PURCHASE HISTORY");

	var getPurchasedOrders = "select productName, productDesc, productPrice, sellerInfo, sum(qty) as totalQty from orders where buyerId = "
			+ req.session.userId + " and isPaidFor = 1 group by productId";

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
	}, getPurchasedOrders);

};

// working!
exports.getSales = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED SALES HISTORY");

	var getSoldOrders = "select productName, productDesc, sum(orders.qty) as qtySold, price from orders inner join products on orders.productId = products.productId where sellerId ="
			+ req.session.userId
			+ " and isPaidFor = 1 group by products.productId order by modifiedTime";

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
	}, getSoldOrders);

}