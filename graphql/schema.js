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

  type Song {
    _id: ID!
    name: String
    albumId: ID!
    artwork: String
    url: String
    genres: [String]
  }

  type Query {
    artists: [Artist]
    albums: [Album]
    songs: [Song]
  }
`);

module.exports.schema = schema;