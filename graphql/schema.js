const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers').resolvers;

const typeDefs = `
  type Artist {
    _id: ID!
    name: String
    image: String
  }

  type Album {
    _id: ID!
    name: String
    artist: Artist
    artistId: ID!
    artwork: String
  }

  type Song {
    _id: ID!
    name: String
    albumId: ID!
    url: String
    genres: [String]
    playCount: Int
  }

  type Query {
    artists(random: Boolean, limit: Int): [Artist]
    albums: [Album]
    songs: [Song]
  }
`;

module.exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers
});