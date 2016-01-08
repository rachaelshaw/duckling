/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

// Ensure a "sails" can be located:
(function() {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }

  // Disable grunt if in production mode

  // Pulls any additional configuration properties from the sails.rc file and adds it into the config dictionary.
  var config = rc('sails');

  /*
   We want to know what environment mode we're in.  The mother of all environment variables in node is NODE_ENV. Once Node loads we can access NODE_ENV from the `process` dictionary.  The `process` dictionary is one of the global dictionaries of Node.  That is we can access it from anywhere as it is globally available. `process.env` contains the user environment for a running node instance. So where does this get set?  We can set it manually from the command-line, however, the PaaS usuallly sets this for us. For example, during the heroku build process, Heroku will set NODE_ENV to production.  We're going to be altering the Heroku default build package because we want our grunt tasks for production to run during the build process.
   */

   // Check to if we're in production mode.
   if (process.env.NODE_ENV === 'production' || process.env.nogrunt) {

    // If there's no .rc or you haven't configured a hooks object in your rc file then set it to empty dictionary
    config.hooks = config.hooks || {};

    // turn grunt completely off
    config.hooks.grunt = false;
  }

  // Start server and passing the config we just built up into Sails
  sails.lift(config);
})();
