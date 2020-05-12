import { apikey } from './apikey';

const loc = document.querySelector(".location");
const degrees = document.querySelector(".degrees");
const description = document.querySelector(".description");
const icon = document.querySelector(".weather-icon");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
       const { latitude, longitude } = position.coords;
       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apikey}`;
       fetch(url).then(response => response.json()).then(response => {
           console.log(response);
           loc.textContent = response.name;
           degrees.textContent = response.main.temp;
           const mapDescription = (descriptionString) => {
            const newString = descriptionString.replace(descriptionString[0], descriptionString[0].toUpperCase());
            return newString
           }
           description.textContent = mapDescription(response.weather[0]["description"]);
           // Change icon
           const iconCode = response.weather[0]["icon"];
           const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
           icon.src = iconUrl;

           // Change temp to celsius if clicked
           const temp = document.querySelector(".temp");
           temp.addEventListener("click", function() {
               if (document.querySelector(".degrees-type").textContent === " ºF") {
                document.querySelector(".degrees-type").textContent = " ºC"
                degrees.textContent = Math.floor((response.main.temp - 32) / (9/5));
               } else {
                document.querySelector(".degrees-type").textContent = " ºF";
                degrees.textContent = response.main.temp;
               }
           })
    });
    })
};