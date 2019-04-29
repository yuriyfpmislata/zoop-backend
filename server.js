require("dotenv").config();

const {
  APP_PORT,
  APP_HOSTNAME
} = process.env;

const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql');
const bodyParser = require('body-parser');

const DB = require('./mongodb').DB;
const schema = require('./graphql/schema').schema;
const resolvers = require('./graphql/resolvers').resolvers;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    version: require('./package.json').version
  });
});

app.get('/songs', async (req, res) => {
  const songs = await DB.collection('songs').find({}).toArray();

  res.json({
    songs
  });
});

app.use(
  '/graphql',
  bodyParser.json(),
  expressGraphQL({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

app.listen(APP_PORT, APP_HOSTNAME, async () => {
  await DB.connect();

  console.log(`[expess] listening @ ${APP_HOSTNAME}:${APP_PORT}`);
});
