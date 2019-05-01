const Artists = require('../mongodb/artists');
const Albums = require('../mongodb/albums');

const resolvers = {
  async artists() {
    return await Artists.findAll();
  },
  async albums() {
    return await Albums.findAll();
  }
}

module.exports.resolvers = resolvers;