require("dotenv").config();

const mongodb = require('mongodb');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  MONGODB_HOSTNAME
} = process.env;

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}?retryWrites=true`;

let DB;

async function connect() {
  try {
    const connection = await mongodb.connect(MONGODB_URI, {
      useNewUrlParser: true
    });

    DB = connection.db(MONGODB_DATABASE);

    console.log(`[mongodb] connected to ${MONGODB_DATABASE}`);
  } catch (err) {
    console.trace(`[mongodb] error while connecting`, err);
  }
}

function collection(colectionName) {
  return DB.collection(colectionName);
}

module.exports.DB = {
  connect,
  collection
};