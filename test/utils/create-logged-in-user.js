/**
 * Create a logged in user to use for tests
 */

var request = require('supertest');
var Passwords = require('machinepack-passwords');

module.exports = function(agent, cb) {
  // Encrypt the password
  Passwords.encryptPassword({
    password: 'abc123'
  })
  .exec({
    error: cb,
    success: function(password) {
      User.create({
        username: 'test',
        email: 'test@test.com',
        encryptedPassword: password
      })
      .exec(function(err, user) {
        if(err) { return cb(err); }

        // Login the user
        agent
        .put('/login')
        .send({
          username: 'test',
          password: 'abc123'
        })
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if(err) { return cb(err); }
          cb();
        });
      });
    }
  });
}