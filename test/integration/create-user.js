// POST /user/signup'
// UserController.signup

var assert = require('assert');
var request = require('supertest');

describe('User Controller :: ', function() {
  describe('POST /user/signup :: ', function() {

    // Loggedin Policy
    describe('When logged in :: ', function() {
      var agent;

      // Before, create a user and login
      before(function(done) {
        var fn = require('../utils/create-logged-in-user');
        agent = request.agent(sails.hooks.http.app);
        fn(agent, done);
      });

      it('should return a 403 response code', function(done) {

        // Make the http request
        agent
        .post('/user/signup')
        .send({
          username: 'foo',
          password: 'barbaz'
        })
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if(err) { return done(err); }

          // Check that the status code is a 403
          assert.equal(res.statusCode, 403);

          done();
        });
      });

    });

    // Loggedout policy

    describe('When logged out ::', function() {
      
      // Email validation
      describe('With an invalid email address', function() {

        // missing email
        it('should return a 400 status code when missing', function(done) {

          // Make the http request
          request(sails.hooks.http.app)
          .post('/user/signup')
          .send({
            username: 'foo',
            password: 'barbaz'
          })
          .set('Content-Type', 'application/json')
          .end(function(err, res) {
            if(err) { return done(err); }

            // Check that the status code is a 400
            assert.equal(res.statusCode, 400);

            done();
          });
        });

        // malformed email
        it('should return a 400 status code when malformed', function(done) {
          // Make the http request
          request(sails.hooks.http.app)
          .post('/user/signup')
          .send({
            username: 'foo',
            password: 'barbaz',
            email: 'foobarbaz'
          })
          .set('Content-Type', 'application/json')
          .end(function(err, res) {
            if(err) { return done(err); }

            // Check that the status code is a 400
            assert.equal(res.statusCode, 400);

            done();
          });
        });

      });

      describe('With valid properties', function() {

        // Hold the response so that we can test it
        var userResponse;

        // Create the new user
        before(function(done) {
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
            done();
          });
        });

        it('should return a 200 response code', function() {
          assert.equal(userResponse.statusCode, 200);
        });

        it('should return the username of the user in the body', function() {
          assert.equal(userResponse.body.username, 'foo');
        });

        it('should set the gravatar on the user record', function(done) {
          User.findOne({ username: 'foo' }).exec(function(err, user) {
            if(err) { return done(err); }
            assert(user);
            assert(user.gravatarURL);
            assert.notEqual(user.gravatarURL, '');
            done();
          });
        });

      });

    });
  });
});