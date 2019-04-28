require("dotenv").config();

const {
  APP_PORT,
  APP_HOSTNAME
} = process.env;

const {
  version
} = require('./package.json');

const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');

const DB = require('./mongodb').DB;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    version
  });
});

app.get('/songs', async (req, res) => {
  const songs = await DB.collection('songs').find({}).toArray();

  res.json({
    songs
  });
});

const schema = buildSchema(`
  type Query {
    test: String
  }
`);

const rootValue = {
  test() {
    return `Hello GraphQL`;
  }
}

app.use(
  '/graphql',
  bodyParser.json(),
  expressGraphQL({
    schema,
    rootValue,
    graphiql: true
  })
);

app.listen(APP_PORT, APP_HOSTNAME, async () => {
  await DB.connect();

  console.log(`[expess] listening @ ${APP_HOSTNAME}:${APP_PORT}`);
});
