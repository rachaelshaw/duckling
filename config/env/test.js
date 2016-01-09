/**
 * Test environment settings
 *
 * <TO DO>
 *
 */

module.exports = {

  models: {
    connection: 'memory'
  },

  connections: {
    memory: {
      adapter: 'sails-memory',
    }
  },

  session: {
    adapter: 'memory'
  },

};
