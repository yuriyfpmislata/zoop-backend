require("dotenv").config();

const mongodb = require('mongodb');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  MONGODB_HOSTNAME
} = process.env;

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}?retryWrites=true`;

async function connect() {
  console.log(`[mongodb] connecting...`);

  try {
    const connection = await mongodb.connect(MONGODB_URI, {
      useNewUrlParser: true
    });

    console.log(`[mongodb] connected to ${MONGODB_DATABASE}`);

    return connection.db(MONGODB_DATABASE);
  } catch (err) {
    console.log(`[mongodb] error while connecting`);
    console.log(JSON.stringify(err));
  }
}

module.exports.DB = {
  connect
};