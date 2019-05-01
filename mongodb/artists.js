const DB = require('.').DB;

const COLL_NAME = 'artists';

async function findAll() {
  return await DB.collection(COLL_NAME).find().toArray();
}

module.exports = {
  findAll
}