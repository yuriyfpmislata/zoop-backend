const Artists = require('../mongodb/artists');
const Albums = require('../mongodb/albums');
const Songs = require('../mongodb/songs');

const resolvers = {
  Query: {
    async artists() {
      return await Artists.findAll();
    },
    async albums() {
      return await Albums.findAll();
    },
    async songs() {
      return await Songs.findAll();
    }
  }
}

module.exports.resolvers = resolvers;