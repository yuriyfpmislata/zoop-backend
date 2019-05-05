const DB = require('.').DB;

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

async function findTopPlayed(limit = 0) {
  return await DB.collection(COLL_NAME).find()
    .sort({ playCount: -1 })
    .limit(limit)
    .toArray();
}

module.exports = {
  findAll,
  findTopPlayed
}