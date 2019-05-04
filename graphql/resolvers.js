const Artists = require('../mongodb/artists');
const Albums = require('../mongodb/albums');
const Songs = require('../mongodb/songs');

const resolvers = {
  Query: {
    async artists(_, args) {
      if (args && args.random) {
        return await Artists.findRandom(args.limit);
      }

      return await Artists.findAll();
    },
    async albums() {
      return await Albums.findAll();
    },
    async songs() {
      return await Songs.findAll();
    }
  },
  Album: {
    async artist(album) {
      return await Artists.findById(album.artistId);
    }
  }
}

module.exports.resolvers = resolvers;