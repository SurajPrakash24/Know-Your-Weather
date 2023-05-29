const express = require("express");
const ejs = require("ejs");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var query = "";
var temp = "";
var des = "Enter Your City Name and Click the Search button";
var iconUrl = "";
var minTemp = "";
var maxTemp = "";
var feelsLike = "";
var pressure = "";
var humidity = "";
var wind = "";

app.get("/", function (req, res) {
    res.render("index", { city: query, ph: iconUrl, tem: temp, des: des, mint: minTemp, maxt: maxTemp, flike: feelsLike, press: pressure, hum: humidity, wspeed: wind });
});

app.post("/", function (req, res) {
    query = req.body.cityname;
    if (query == "") {
        query = "";
        temp = "";
        des = "Please enter Your City Name";
        iconUrl = "";
        minTemp = "";
        maxTemp = "";
        feelsLike = "";
        pressure = "";
        humidity = "";
        wind = "";
        res.redirect("/");
    } else {
        const apikey = process.env.APIKey;
        const unit = "metric";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;
        https.get(url, function (response) {
            // console.log(response.statusCode);
            if (response.statusCode == "404") {
                query = "";
                temp = "";
                des = "Please type correct City Name";
                iconUrl = "";
                minTemp = "";
                maxTemp = "";
                feelsLike = "";
                pressure = "";
                humidity = "";
                wind = "";
                res.redirect("/");
            } else {
                response.on("data", function (data) {
                    const weatherData = JSON.parse(data);
                    temp = weatherData.main.temp + " °C";
                    des = weatherData.weather[0].description;
                    let icon = weatherData.weather[0].icon;
                    iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    minTemp = weatherData.main.temp_min + " °C";
                    maxTemp = weatherData.main.temp_max + " °C";
                    feelsLike = weatherData.main.feels_like + " °C";
                    pressure = weatherData.main.pressure + " hPa";
                    humidity = weatherData.main.humidity + " %";
                    wind = weatherData.wind.speed + " m/s";
                    res.redirect("/");
                })
            }
        })
    }
});
app.listen(3000, function () {
    console.log("Server started at port 3000");
});