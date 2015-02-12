var config = require('../config');

// 864721259083786

var nameMap = {
  
};

exports.handleData = function(req, res) {
  console.log(req.query);
  res.send("Ok!");
}