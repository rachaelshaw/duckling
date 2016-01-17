/**
 * Create a user to use for tests
 */

var request = require('supertest');
var Passwords = require('machinepack-passwords');
var USER_FIXTURE = require('../fixtures/user');

module.exports = function(userResponse, cb) {
  request(sails.hooks.http.app)
  .post('/user/signup')
  .send({
    username: 'foo',
    password: 'barbaz',
    email: 'foo.bar@baz.com'
  })
  .set('Content-Type', 'application/json')
  .end(function(err, res) {
    if(err) { return done(err); }
    userResponse = res;
    return cb();
  });
}