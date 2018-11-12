require("dotenv").config();
var request = require("request");
var Spotify = require("node-spotify-api");
var keys = require("./keys");

var divider = "----------------------";

var spotify = new Spotify(keys.spotify);

var option = process.argv[2];
var input = process.argv.slice(3).join(" ");

if (option === "concert-this") {
  bandsInTown(input);
} else if (option === "spotify-this-song") {
  spotifyAPI(input);
} else if (option === "movie-this") {
  omdbAPI(input);
} else if (option === "do-what-it-says") {
  random(input);
} else {
  console.log("Typing failed");
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
      "Date of the Event: " + jsonData.datetime
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
// function random() {}
