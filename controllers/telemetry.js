var config = require('../config');

var nameMap = {
  
};

function handleData(req, res) {
  console.log(req.query);
  res.send("Ok!");
}