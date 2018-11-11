var dotenv = require("dotenv").config();
var request = require("request");

//var spotify = new Spotify(keys.spotify);

var option = process.argv[2];
var input = process.argv.slice(3).join(" ");

if (option === "concert-this") {
  bandsInTown(input);
} else if (option === "spotify-this-song") {
  spotify(input);
} else if (option === "movie-this") {
  omdb(input);
} else if (option === "do-what-it-says") {
  random(input);
} else {
  console.log("Typing failed");
}
//https://rest.bandsintown.com/artists/madonna/events?app_id=d94b32b3911847a25852f17070a59807
function bandsInTown(artist) {
  var URL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=d94b32b3911847a25852f17070a59807";

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
// function spotify() {}
// function omdb() {}
// function random() {}
