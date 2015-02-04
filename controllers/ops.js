var config = require('../config');

exports.health = function(req, res) {
    res.send({ "ok": true });
};