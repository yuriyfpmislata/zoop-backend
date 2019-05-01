const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Artist {
    _id: ID!
    name: String
  }

  type Query {
    artists: [Artist]
  }
`);

module.exports.schema = schema;