const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    test: String
  }
`);

module.exports.schema = schema;