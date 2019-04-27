require("dotenv").config();

const {
  APP_PORT,
  APP_HOSTNAME
} = process.env;

const {
  version
} = require('./package.json');

const express = require('express');

const app = express();

app.get('*', (req, res) => {
  res.json({
    version
  });
});

app.listen(APP_PORT, APP_HOSTNAME, () => {
  console.log(`[expess] listening at port 4000`);
});
