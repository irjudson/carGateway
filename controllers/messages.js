var config = require('../config')
  , utils = require('../utils');

exports.create = function(req, res) {
	var pidPairs = req.rawBody.split(';');

	var message = {
		body: {}
	};

	pidPairs.forEach(function(pidPair) {
		var pair = pidPair.split(',');

		var key = pair[0];
		var value = parseFloat(pair[1]);
		if (isNaN(value))
			value = pair[1];

		if (key === 'type')
			message[key] = value;
		else
			message.body[key] = value;
	});

    config.message_hub.send(req.user, [ message ], function(err, messages) {
        if (err) return utils.handleError(res, err);

        res.send(200);
    });
};
