/**
 * Before running any API tests, load (but don't lift!) our app.
 *
 * NOTICE:
 * This exposes the `sails` global.
 *
 * @framework mocha
 */

var Sails = require('../node_modules/sails');

before(function(done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    hooks: {
      grunt: false
    }
  }, done);
});

after(function(done) {
  Sails.lower(done);
});