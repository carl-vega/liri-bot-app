require("dotenv").config();
var request = require("request");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var moment = require("moment");
var fs = require("fs");
var something = [];

var divider = "----------------------";

var spotify = new Spotify(keys.spotify);

var option = process.argv[2];

if (option === "do-what-it-says") {
  fs.readFile("random.txt", function(err, data) {
    if (err) throw err;
    var split = data.toString().split(",");
    doWhatItSays(split[0], split[1]);
  });
} else {
  doWhatItSays(option, process.argv.slice(3).join(" "));
}

function doWhatItSays(option, search) {
  switch (option) {
    case "concert-this":
      return bandsInTown(search);
    case "spotify-this-song":
      return spotifyAPI(search);
    case "movie-this":
      return omdbAPI(search);
    case "feeling-lucky":
      return feelingLucky();
    case "help":
      return help();
    default:
      console.log("Typing failed");
  }
}

function bandsInTown(artist) {
  var URL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=" +
    keys.bands.bandskey;

  request(URL, function(err, response, body) {
    var jsonData = JSON.parse(body)[0];

    var bandsData = [
      "Name of the Venue: " + jsonData.venue.name,
      "Venue Location: " +
        jsonData.venue.city +
        ", " +
        jsonData.venue.region +
        ", " +
        jsonData.venue.country,
      "Date of the Event: " + moment(jsonData.datetime).format("MM/DD/YYYY")
    ].join("\n\n");
    console.log("\n" + bandsData);
  });
}

function spotifyAPI(track) {
  spotify.search({ type: "track", query: track }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    const songData = data.tracks.items.map(track =>
      [
        `Song: ${track.name}`,
        `Artist(s): ${track.artists.map(artist => artist.name).join(", ")}`,
        `Preview: ${track.preview_url || "None"}`,
        `Album: ${track.album.name}`
      ].join("\n")
    );
    console.log("\n" + songData.join("\n" + divider + "\n"));
  });
}

function omdbAPI(movie) {
  const URL =
    "http://www.omdbapi.com/?t=" +
    movie +
    "&y=&plot=short&r=json&apikey=" +
    keys.omdb.apikey;

  request(URL, function(error, response, body) {
    if (error) {
      return console.error(error);
    }

    if (body.length < 1) {
      return console.log("No movies were found!");
    }
    const jsonData = JSON.parse(body);

    const movieData = [
      "Title: " + jsonData.Title,
      "Year: " + jsonData.Year,
      "IMDB Rating: " + jsonData.Ratings[0].Value,
      "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
      "Country: " + jsonData.Country,
      "Language: " + jsonData.Language,
      "Plot Summary: " + jsonData.Plot,
      "Actor(s): " + jsonData.Actors
    ].join("\n");

    console.log("\n" + movieData);
  });
  // var URL = "http://www.omdbapi.com/?t=" + movie + "&" + ;
}
function feelingLucky() {
  var spin1 = Math.floor(Math.random() * 3);
  var spin2 = Math.floor(Math.random() * 20);

  fs.readFile("feeling-lucky.json", "utf8", function(err, data) {
    if (err) throw err;
    something = JSON.parse(data);

    if (spin1 === 0) {
      var pass = something[spin1][spin2];
      console.log("You are seeing: concert-this\n\nArtist: " + pass);
      bandsInTown(pass);
    } else if (spin1 === 1) {
      var pass = something[spin1][spin2];
      console.log("You are seeing: spotify-this-song\n\nSong: " + pass);
      spotifyAPI(pass);
    } else if (spin1 === 2) {
      var pass = something[spin1][spin2];
      console.log("You are seeing: movie-this\n\nMovie: " + pass);
      omdbAPI(pass);
    }
  });
}
function help() {
  console.log(
    "\nnode liri.js concert-this <artist/band name>\nnode liri.js spotify-this-song <song title>\nnode liri.js movie-this <movie title>\nnode liri.js do-what-it-says\nnode liri.js feeling-lucky"
  );
}
