require("dotenv").config();

const DB = require('../mongodb/index').DB;

const {
  MONGODB_DATABASE
} = process.env;

const rawSongs = require('./rawSongs.json');

const artists = rawSongs.map(s => s.artist).sort((a, b) => a - b);
const artistsDedup = [...new Set(artists)];

const albums = rawSongs.map(s => s.album).sort((a, b) => a - b);
const albumsDedup = [...new Set(albums)];

DB.connect()
  .then(async () => {
    await DB.getDB().dropDatabase(MONGODB_DATABASE);
    console.log(`[_db] dropped "${MONGODB_DATABASE}" database`);

    // **********

    await insertArtists(artistsDedup);
    console.log(`[_db] inserted artists`);

    const artistsDB = await DB.collection('artists').find().toArray();
    console.log(`[_db] artists in DB`, artistsDB);

    // **********

    await insertAlbums(albumsDedup, artistsDB, rawSongs);
    console.log(`[_db] inserted albums`);

    const albumsDB = await DB.collection('albums').find().toArray();
    console.log(`[_db] albums in DB`, albumsDB);

    // **********

    await insertSongs(rawSongs, albumsDB);
    console.log(`[_db] inserted songs`);

    const songsDB = await DB.collection('songs').find().toArray();
    console.log(`[_db] songs in DB`, songsDB);
  })
  .catch(err => {
    console.log(`[_db] connect error`, err)
  })

// **********

async function insertArtists(artists) {
  return await DB.collection('artists').insertMany(
    artists.map(name => ({ name }))
  );
}

async function insertAlbums(albums, artistsDB, songs) {
  return await DB.collection('albums').insertMany(
    albums.map(albumName => {
      const artistName = songs.find(song => song.album === albumName).artist;
      const artistId = artistsDB.find(artist => artist.name === artistName)._id;
      const artwork = songs.find(song => song.album === albumName).artwork;

      return {
        name: albumName,
        artistId,
        artwork
      }
    })
  );
}

async function insertSongs(songs, albumsDB) {
  return await DB.collection('songs').insertMany(
    songs.map(song => {
      const albumName = song.album;
      const albumId = albumsDB.find(album => album.name === albumName)._id;

      return {
        name: song.name,
        albumId,
        url: song.url,
        genres: song.genres
      }
    })
  );
}