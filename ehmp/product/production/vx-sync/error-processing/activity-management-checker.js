'use strict';

function check(logger, config, callback) {
	logger.debug('activity-management-checker.check() DEFAULT IMPLEMENTATION (always returns true)');
	setTimeout(callback, 0, null, true);
}

module.exports = check;