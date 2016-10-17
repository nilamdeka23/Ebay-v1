/**
 * New node file
 */
var logger = require('./logger');

exports.validatePayment = function(req, res) {
	
	logger.info("USER ID: " + req.session.userId
			+ " MAKES A PAYMENT");

	var json_response;

	if (isValidCardNo(req.param("cardNum")) && isValidCVV(req.param("cardCVV"))) {

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

	function isValidCardNo(card_no) {
		var pattern = /^\d{16}$/;
		return pattern.test(card_no);
	}

	function isValidCVV(cvv) {
		var pattern = /^\d{3}$/;
		return pattern.test(cvv);
	}

};