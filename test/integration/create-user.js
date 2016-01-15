// POST /user/signup'
// UserController.signup

var assert = require('assert');
var request = require('supertest');
var Passwords = require('machinepack-passwords');

describe('User Controller :: ', function() {
  describe('POST /user/signup :: ', function() {

    // Testing when authenticated
    describe('When logged in :: ', function() {

      // A placeholder that will simulate an instance of a browser
      var agent;
      
      // Before we start the test, create a user and then login
      before(function(done) {

        // By using request.agent and passing in the app dictionary we can
        // now simulate persistent cookies in addition to making requests.
        // request.agent gets properties like the existing `port` and fully
        // qualified url. 
        agent = request.agent(sails.hooks.http.app);
        
        // Encrypt the password
        Passwords.encryptPassword({
          password: 'abc123'
        })
        .exec({
          error: done,
          success: function(password) {

            // Create the user
            User.create({
              username: 'test',
              email: 'test@test.com',
              encryptedPassword: password
            })
            .exec(function(err, user) {
              if(err) { return done(err); }

              // Authenticate the newly created user
              agent
              .put('/login')
              .send({
                username: 'test',
                password: 'abc123'
              })
              .set('Content-Type', 'application/json')
              .end(function(err, res) {
                if(err) { return done(err); }
                console.log('res.status', res.status);
                return done();
              });
            });
          }
        });
      });

      it('should return a 403 response code', function(done) {

        // Make a request to signup a new user
        agent
        .post('/user/signup')
        .send({
          username: 'foo',
          email: 'foo@foo.com',
          password: 'barbaz'
        })
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if(err) { return done(err); }

          // Check that the status code return is a 403
          assert.equal(res.statusCode, 403);

          return done();
        });
      });

    });

    // // Loggedout policy

    // describe('When logged out ::', function() {
      
    //   // Email validation
    //   describe('With an invalid email address', function() {

    //     // missing email
    //     it('should return a 400 status code when missing', function(done) {

    //       // Make the http request
    //       request(sails.hooks.http.app)
    //       .post('/user/signup')
    //       .send({
    //         username: 'foo',
    //         password: 'barbaz'
    //       })
    //       .set('Content-Type', 'application/json')
    //       .end(function(err, res) {
    //         if(err) { return done(err); }

    //         // Check that the status code is a 400
    //         assert.equal(res.statusCode, 400);

    //         done();
    //       });
    //     });

    //     // malformed email
    //     it('should return a 400 status code when malformed', function(done) {
    //       // Make the http request
    //       request(sails.hooks.http.app)
    //       .post('/user/signup')
    //       .send({
    //         username: 'foo',
    //         password: 'barbaz',
    //         email: 'foobarbaz'
    //       })
    //       .set('Content-Type', 'application/json')
    //       .end(function(err, res) {
    //         if(err) { return done(err); }

    //         // Check that the status code is a 400
    //         assert.equal(res.statusCode, 400);

    //         done();
    //       });
    //     });

    //   });

    //   describe('With valid properties', function() {

    //     // Hold the response so that we can test it
    //     var userResponse;

    //     // Create the new user
    //     before(function(done) {
    //       request(sails.hooks.http.app)
    //       .post('/user/signup')
    //       .send({
    //         username: 'foo',
    //         password: 'barbaz',
    //         email: 'foo.bar@baz.com'
    //       })
    //       .set('Content-Type', 'application/json')
    //       .end(function(err, res) {
    //         if(err) { return done(err); }
    //         userResponse = res;
    //         done();
    //       });
    //     });

    //     it('should return a 200 response code', function() {
    //       assert.equal(userResponse.statusCode, 200);
    //     });

    //     it('should return the username of the user in the body', function() {
    //       assert.equal(userResponse.body.username, 'foo');
    //     });

    //     it('should set the gravatar on the user record', function(done) {
    //       User.findOne({ username: 'foo' }).exec(function(err, user) {
    //         if(err) { return done(err); }
    //         assert(user);
    //         assert(user.gravatarURL);
    //         assert.notEqual(user.gravatarURL, '');
    //         done();
    //       });
    //     });

    //   });

    // });
  });
});