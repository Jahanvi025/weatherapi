import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));

const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
const API_KEY = "6de9af58cfd761721cbdb6ce2dfbbec3";
const date = new Date();
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

const day = date.toLocaleString('en-IN', options);
app.set("view engine", "ejs");
app.get("/", (req, res)=>{
  res.render("index.ejs");
});

app.post("/", async(req, res) =>{
   const place = req.body.searchbar;
   //console.log(place);
   try {
    const result = await axios.get(`${API_URL}q=${place}&appid=${API_KEY}&units=metric`);
    
    const icon = result.data.weather[0].icon;
    const description = result.data.weather[0].description;
    const temp = result.data.main.temp;
    const Name = result.data.name;
    res.render("index.ejs", { 
       wicon : icon,
       wdescription : description,
       wtemp :temp,
       Today : day,
       wplace : Name,
       humidity : result.data.main.humidity,
       maxtemp : result.data.main.temp_max,
       mintemp : result.data.main.temp_min,
       pressure : result.data.main.pressure,
       windspeed : result.data.wind.speed,
       feelslike : result.data.main.feels_like,
       gust : result.data.wind.gust,
       wdeg : result.data.wind.deg,
       latitude : result.data.coord.lat,
       longitude : result.data.coord.lon,
    });
   
  } catch (error) {
    res.render("index.ejs", { content: "Oops! Loaction is not Valid..." });
  }
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});