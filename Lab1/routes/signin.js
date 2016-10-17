/**
 * New node file
 */
var ejs = require("ejs");
var mysql = require('./mysql');
var crypto = require('crypto');
var logger = require('./logger');

exports.signInPage = function(req, res) {

	logger.info("SIGNIN PAGE is HIT");

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		if (!err) {
			res.end(result);
		} else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

// working!
exports.signIn = function(req, res) {

	logger.info("USER with EMAIL: " + req.param("email") + " tries SIGNING IN");

	// encrypt password to match
	var cryptoCipher = crypto.createCipher('aes-256-ctr', '14Lab1');
	var cryptedPwd = cryptoCipher.update(req.param("password"), 'utf8', 'hex');
	cryptedPwd += cryptoCipher.final('hex');

	var getUser = "select * from users where email='" + req.param("email")
			+ "' and password='" + cryptedPwd + "'";

	mysql
			.fetchData(
					function(err, results) {

						if (err) {
							throw err;

						} else {
							var json_response;

							if (results.length > 0) {
								logger.info("USER with EMAIL: "
										+ req.param("email") + " and USER ID: "
										+ results[0].userId
										+ " SIGNED IN SUCCESSFULLY");
								// initialize session
								req.session.userId = results[0].userId;
								req.session.firstname = results[0].firstname;
								req.session.lastLogin = results[0].lastLoginTime;

								json_response = {
									"statusCode" : 200
								};
								res.send(json_response);

								// update last login time
								var updateLastLogin = "update users set lastLoginTime = current_timestamp() where userId = "
										+ req.session.userId;

								mysql.fetchData(function(err, results) {

									if (err) {
										throw err;
									} else {

										console.log("LastLogin Updated",
												results.affectedRows);
									}
								}, updateLastLogin);

							} else {

								json_response = {
									"statusCode" : 401
								};
								res.send(json_response);
							}
						}
					}, getUser);
};

exports.signUp = function(req, res) {

	logger.info("USER with EMAIL: " + req.param("email") + " tries SIGNING UP");

	// encrypt password
	var cryptoCipher = crypto.createCipher('aes-256-ctr', '14Lab1');
	var cryptedPwd = cryptoCipher.update(req.param("password"), 'utf8', 'hex');
	cryptedPwd += cryptoCipher.final('hex');

	var insertUser = "insert into users (email, password, firstname, lastname) values ('"
			+ req.param("email")
			+ "', '"
			+ cryptedPwd
			+ "', '"
			+ req.param("firstName") + "', '" + req.param("lastName") + "')";

	mysql
			.fetchData(
					function(err, results) {

						console.log(results);

						if (err) {
							throw err;
						} else {
							var json_response;
							if (results.insertId > 0) {

								var getUser = "select * from users where email='"
										+ req.param("email")
										+ "' and password='" + cryptedPwd + "'";

								mysql
										.fetchData(
												function(err, results) {

													if (err) {
														throw err;

													} else {

														if (results.length > 0) {
															logger
																	.info("USER with EMAIL: "
																			+ req
																					.param("email")
																			+ " and USER ID: "
																			+ results[0].userId
																			+ " SIGNED UP SUCCESSFULLY");

															// initialize
															// session
															req.session.userId = results[0].userId;
															req.session.firstname = results[0].firstname;
															req.session.lastLogin = results[0].lastLoginTime;

															json_response = {
																"statusCode" : 200
															};
															res
																	.send(json_response);

															// update last login
															// time
															var updateLastLogin = "update users set lastLoginTime = current_timestamp() where userId = "
																	+ req.session.userId;

															mysql
																	.fetchData(
																			function(
																					err,
																					results) {

																				if (err) {
																					throw err;
																				} else {

																					console
																							.log(
																									"LastLogin Updated",
																									results.affectedRows);
																				}
																			},
																			updateLastLogin);

														} else {
															json_response = {
																"statusCode" : 401
															};
															res
																	.send(json_response);

														}
													}
												}, getUser);

							} else {

								json_response = {
									"statusCode" : 401
								};
								res.send(json_response);
							}
						}

					}, insertUser);
};

exports.redirectToHome = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.userId) {
		// get last login time from session object
		var lastLoginTime = req.session.lastLogin + "";
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("home", {
			firstname : req.session.firstname,
			lastLogin : lastLoginTime
		});

	} else {
		res.redirect('/');
	}
};

exports.signout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};
