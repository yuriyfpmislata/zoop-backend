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

    await insertArtists(artistsDedup, rawSongs);
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

async function insertArtists(artists, songs) {
  return await DB.collection('artists').insertMany(
    artists.map(name => {
      const image = songs.find(song => song.artist === name).artist_image;
      return { name, image }
    })
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
  const MIN_PLAY_COUNT = 20;
  const MAX_PLAY_COUNT = 300;
  return await DB.collection('songs').insertMany(
    songs.map(song => {
      const albumName = song.album;
      const albumId = albumsDB.find(album => album.name === albumName)._id;

      return {
        name: song.name,
        albumId,
        url: song.url,
        genres: song.genres,
        playCount: _randomBetween(MIN_PLAY_COUNT, MAX_PLAY_COUNT)
      }
    })
  );
}

// https://stackoverflow.com/a/7228322/3499595
function _randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}