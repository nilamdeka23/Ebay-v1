/**
 * New node file
 */
var mysql = require("./mysql");

// working!
exports.placeBid = function(req, res) {

	var insertBid = "insert into bids (bidderId, bidProductId, bidAmount) values ("
			+ req.session.userId
			+ ", "
			+ req.param("productId")
			+ ", "
			+ req.param("bidAmount") + ")";

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			var json_response;
			if (results.affectedRows > 0) {

				console.log("Valid bid : " + results.insertId, ",",
						results.affectedRows);

				json_response = {
					"statusCode" : 200
				};
				res.send(json_response);

			} else {

				console.log("Invalid bid : " + results.affectedRows);

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, insertBid);

};

