const DB = require('.').DB;

const COLL_NAME = 'artists';

async function findAll() {
  return await DB.collection(COLL_NAME).find().toArray();
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