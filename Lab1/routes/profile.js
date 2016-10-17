var mysql = require('./mysql');
var logger = require('./logger');

// working!
exports.getProfile = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED PROFILE PAGE");

	var getProfile = "select * from users where userId=" + req.session.userId;

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.length > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results[0]
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, getProfile);
};

// working!
exports.updateProfile = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried UPDATING PRFOILE PAGE");

	var updateProfile = "update users set email = '" + req.param("email")
			+ "', password = '" + req.param("password") + "',firstName = '"
			+ req.param("firstName") + "', lastName = '"
			+ req.param("lastName") + "', dob = '" + req.param("dob")
			+ "', contact = '" + req.param("contact") + "', about = '"
			+ req.param("about") + "', address = '" + req.param("address")
			+ "' where userId = " + Number(req.session.userId);

	mysql.fetchData(function(err, results) {
		console.log(results);
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
	}, updateProfile);

};
