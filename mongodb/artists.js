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

module.exports = {
  findAll,
  findById
}