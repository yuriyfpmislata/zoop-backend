const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers').resolvers;

const typeDefs = `
  type Artist {
    _id: ID!
    name: String
    image: String
    albums: [Album]
    songs: [Song]
  }

  type Album {
    _id: ID!
    name: String
    artist: Artist
    artistId: ID!
    artwork: String
    songs: [Song]
  }

  type Song {
    _id: ID!
    name: String
    albumId: ID!
    url: String
    genres: [String]
    playCount: Int
    artist: Artist
    album: Album
  }

  type Query {
    artists(random: Boolean, limit: Int): [Artist]
    albums: [Album]
    songs: [Song]
    song(id: ID!): Song
    topPlayedSongs(limit: Int): [Song]
    artist(id: ID!): Artist
    album(id: ID!): Album
  }
`;

module.exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers
});