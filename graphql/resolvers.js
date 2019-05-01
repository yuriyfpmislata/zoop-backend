const { findAll } = require('../mongodb/artists');

const resolvers = {
  async artists() {
    return await findAll();
  }
}

module.exports.resolvers = resolvers;