const DB = require('.').DB;
const Songs = require('./songs');
const { ObjectId } = require('mongodb');

const COLL_NAME = 'artists';

async function findAll() {
  const artists = (await DB.connect()).collection(COLL_NAME);

  const mainResult = await artists.aggregate([
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
  const artists = (await DB.connect()).collection(COLL_NAME);

  return (await artists.aggregate([
    {
      $match: {
        _id: ObjectId(_id)
      }
    },
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
  ]).toArray())[0];
}

async function findRandom(limit = 5) {
  const artists = (await DB.connect()).collection(COLL_NAME);

  // https://stackoverflow.com/questions/2824157/random-record-from-mongodb
  return await artists.aggregate([
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