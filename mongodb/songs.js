const DB = require('.').DB;
const { ObjectId } = require('mongodb');

const COLL_NAME = 'songs';

async function findAll() {
  return await DB.collection(COLL_NAME).aggregate([
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
  return (await DB.collection(COLL_NAME).aggregate([
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
  return await DB.collection(COLL_NAME).aggregate([
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
  return await DB.collection(COLL_NAME).find({
    albumId: ObjectId(albumId)
  }).toArray();
}

module.exports = {
  findAll,
  findTopPlayed,
  findById,
  findByAlbumId
}