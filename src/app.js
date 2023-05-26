// Declare application dependencies: express, body-parser, and postman request
const express = require("express");
const bodyParser = require("body-parser");
const request = require("postman-request");
const app = express();

// Configure dotenv package
require("dotenv").config();

// Set up Port, OpenWeatherMap api Key and URL
const port = process.env.PORT || 3001;
const apiKey = `${process.env.API_KEY}`;
const apiURL = "https://api.openweathermap.org/data/2.5/";
const iconURL = "https://openweathermap.org/img/w/";

// Serve static pages from the public directory, it will act as the root directory
// Setup express app and body-parser configurations
// Setup javascript template view engine
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Setup the default display on launch
app.get("/", (req, res) => {
  // No Data will be fetch and displayed onto the index page
  res.render("index", { weather: null, error: null });
});

// On a Post request, the app shall receieve data from OpenWeatherMap using the given arguments
app.post("/", (req, res) => {
  // Get city name passed in the form
  let city = req.body.city;

  // Use city name to fetch data
  // Use the API_KEY in the '.env' file
  let url = `${apiURL}weather?q=${city}&units=metric&appid=${apiKey}`;

  // Make a Server-Side HTTPS Request for data using the URL
  request(url, (err, response, body) => {
    // On return, check the json data fetched
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);

      // Output data to the console so that it can be verified
      //console.log(weather);

      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          error: "Error, please try again",
        });
      } else {
        // Use the data obtained to set up the output
        let place = `${weather.name}, ${weather.sys.country}`,
          /* Calculate the current timezone using the data fetched*/
          timezone = `${new Date(weather.dt * 1000 - weather.timezone * 1000)}`,
          /* Fetch the weather icon using the icon data*/
          icon = `${iconURL}${weather.weather[0].icon}.png`;
        let description = `${weather.weather[0].description}`,
          clouds = `${weather.clouds.all}`,
          temp = `${Math.round(weather.main.temp)}`,
          tempMin = `${Math.round(weather.main.temp_min)}`,
          tempMax = `${Math.round(weather.main.temp_max)}`,
          visibility = `${weather.visibility}`,
          humidity = `${weather.main.humidity}`,
          wind = `${Math.round(weather.wind.speed)}`,
          pressure = `${weather.main.pressure}`;

        // Now render the data to the result page (index.ejs)
        res.render("index", {
          weather: weather,
          place: place,
          timezone: timezone,
          icon: icon,
          description: description,
          clouds: clouds,
          temp: temp,
          tempMin: tempMin,
          tempMax: tempMax,
          visibility: visibility,
          humidity: humidity,
          wind: wind,
          pressure: pressure,
          error: null,
        });
      }
    }
  });
});

// Set up the port configurations
// Start the server and add a message to display when running
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
