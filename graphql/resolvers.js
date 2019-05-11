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
    },
    async song(_, args) {
      return await Songs.findById(args.id);
    },
    async topPlayedSongs(_, args) {
      return await Songs.findTopPlayed(args.limit);
    }
  },
  Album: {
    async artist(album) {
      return await Artists.findById(album.artistId);
    }
  }
}

module.exports.resolvers = resolvers;