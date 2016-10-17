/**
 * New node file
 */
var winston = require('winston'), loggingDir = './public/logs', logger;

logger = new (winston.Logger)({
	transports : [ new winston.transports.File({
		filename : loggingDir + '/events.log',
		maxsize : 5 * 1024 * 1024
	}) ]
});

module.exports = logger;
