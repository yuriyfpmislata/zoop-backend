const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Artist {
    _id: ID!
    name: String
  }

  type Album {
    _id: ID!
    name: String
    artistId: ID!
  }

  type Query {
    artists: [Artist]
    albums: [Album]
  }
`);

module.exports.schema = schema;