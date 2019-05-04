const DB = require('.').DB;

const COLL_NAME = 'songs';

async function findAll() {
  return await DB.collection(COLL_NAME).find().toArray();
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