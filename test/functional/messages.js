var assert = require('assert')
  , config = require('../../config')
  , fixtures = require('../fixtures')
  , log = require('winston')
  , request = require('request');

describe('messages endpoint', function() {
    it('should translate and create a message', function(done) {
        request.post(config.messages_endpoint, {
            body: 'type,location;latitude,21.3;longitude,23.3\ntype,location;latitude,22.3;longitude,24.4',
            headers: {
                Authorization: 'Bearer ' + fixtures.testJwtToken
            }
        }, function(err, resp, body) {
            assert(!err);
            assert.equal(resp.statusCode, 200);

            done();
        });
    });
});