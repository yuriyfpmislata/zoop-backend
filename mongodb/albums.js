const DB = require('.').DB;
const { ObjectId } = require('mongodb');

const COLL_NAME = 'albums';

async function findById(_id) {
  const albums = (await DB.connect()).collection(COLL_NAME);

  return (await albums.aggregate([
    {
      $match: {
        _id: ObjectId(_id)
      }
    },
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
  ]).toArray())[0];
}

async function findAll() {
  const albums = (await DB.connect()).collection(COLL_NAME);

  return await albums.aggregate([
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
  findAll,
  findById
}