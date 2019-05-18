const DB = require('.').DB;
const { ObjectId } = require('mongodb');

const COLL_NAME = 'songs';

async function findAll() {
  const songs = (await DB.connect()).collection(COLL_NAME);

  return await songs.aggregate([
    {
      $lookup: {
        from: "albums",
        localField: "albumId",
        foreignField: "_id",
        as: "album"
      }
    },
    {
      $unwind: "$album"
    },
    {
      $lookup: {
        from: "artists",
        localField: "album.artistId",
        foreignField: "_id",
        as: "artist"
      }
    },
    {
      $unwind: "$artist"
    }
  ]).toArray();
}

async function findById(_id) {
  const songs = (await DB.connect()).collection(COLL_NAME);

  return (await songs.aggregate([
    {
      $match: {
        _id: ObjectId(_id)
      }
    },
    {
      $lookup: {
        from: "albums",
        localField: "albumId",
        foreignField: "_id",
        as: "album"
      }
    },
    {
      $unwind: "$album"
    },
    {
      $lookup: {
        from: "artists",
        localField: "album.artistId",
        foreignField: "_id",
        as: "artist"
      }
    },
    {
      $unwind: "$artist"
    }
  ]).toArray())[0];
}

async function findTopPlayed(limit = 0) {
  const songs = (await DB.connect()).collection(COLL_NAME);

  return await songs.aggregate([
    {
      $lookup: {
        from: "albums",
        localField: "albumId",
        foreignField: "_id",
        as: "album"
      }
    },
    {
      $unwind: "$album"
    },
    {
      $lookup: {
        from: "artists",
        localField: "album.artistId",
        foreignField: "_id",
        as: "artist"
      }
    },
    {
      $unwind: "$artist"
    }
  ])
    .sort({ playCount: -1 })
    .limit(limit)
    .toArray();
}

async function findByAlbumId(albumId) {
  const songs = (await DB.connect()).collection(COLL_NAME);

  return await songs.find({
    albumId: ObjectId(albumId)
  }).toArray();
}

module.exports = {
  findAll,
  findTopPlayed,
  findById,
  findByAlbumId
}