const DB = require('.').DB;

const COLL_NAME = 'albums';

async function findAll() {
  return await DB.collection(COLL_NAME).aggregate([
    {
      $lookup: {
        from: "songs",
        localField: "_id",
        foreignField: "albumId",
        as: "songs"
      }
    },
    {
      $lookup: {
        from: "artists",
        localField: "artistId",
        foreignField: "_id",
        as: "artist"
      }
    },
    {
      $unwind: "$artist"
    }
  ]).toArray();
}

module.exports = {
  findAll
}