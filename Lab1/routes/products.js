/**
 * New node file
 */
var mysql = require('./mysql');
var logger = require('./logger');
// working!
exports.createListing = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " LISTED PRODUCT for SALE of PRODUCT NAME: " + req.param("name"));

	var insertProduct = "insert into products (name, description, sellerId, sellerInfo, price, qty, isBiddable) values ('"
			+ req.param("name")
			+ "', '"
			+ req.param("desc")
			+ "', "
			+ req.session.userId
			+ ", '"
			+ req.param("sellerInfo")
			+ "', "
			+ req.param("price")
			+ ", "
			+ req.param("qty")
			+ ", "
			+ req.param("isBiddable") + ")";

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
	}, insertProduct);
};

// working!
exports.getProducts = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " BROWSED PRODUCTS PAGE");

	var getProducts = "select * from products where sellerId != "
			+ req.session.userId;

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
	}, getProducts);

};
