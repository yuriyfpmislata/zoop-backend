const DB = require('.').DB;
const Songs = require('./songs');

const COLL_NAME = 'artists';

async function findAll() {
  const mainResult = await DB.collection(COLL_NAME).aggregate([
    {
      $lookup: {
        from: "albums",
        localField: "_id",
        foreignField: "artistId",
        as: "albums"
      }
    },
    {
      $lookup: {
        from: "songs",
        localField: "albums._id",
        foreignField: "albumId",
        as: "songs"
      }
    },
  ]).toArray();

  const withAlbumSongs = mainResult.map(async artist => {
    return {
      ...artist,
      albums: artist.albums.map(async album => {
        const songs = await Songs.findByAlbumId(album._id);
        return {
          ...album,
          songs
        }
      })
    }
  });

  return withAlbumSongs;
}

async function findById(_id) {
  return await DB.collection(COLL_NAME).findOne({
    _id
  });
}

async function findRandom(limit = 5) {
  // https://stackoverflow.com/questions/2824157/random-record-from-mongodb
  return await DB.collection(COLL_NAME).aggregate([
    {
      $sample: { size: limit }
    }
  ]).toArray();
}

module.exports = {
  findAll,
  findById,
  findRandom
}