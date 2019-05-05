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
    }
  ]).toArray();
}

module.exports = {
  findAll
}