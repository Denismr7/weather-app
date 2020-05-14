import { apikey } from './apikey';

const loc = document.querySelector(".location");
const degrees = document.querySelector(".degrees");
const description = document.querySelector(".description");
const icon = document.querySelector(".weather-icon");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
       const { latitude, longitude } = position.coords;
       const newUrl = ` https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${apikey} `
       const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apikey}`;
       fetch(newUrl).then(response => response.json()).then(response => {
           console.log(response);
           degrees.textContent = response.current.temp;
           const mapDescription = (descriptionString) => {
            const newString = descriptionString.replace(descriptionString[0], descriptionString[0].toUpperCase());
            return newString
           }
           description.textContent = mapDescription(response.current.weather[0]["description"]);
           // Change icon
           const iconCode = response.current.weather[0]["icon"];
           const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
           icon.src = iconUrl;

           // Change temp to ºF if clicked
           const temp = document.querySelector(".temp");
           temp.addEventListener("click", function() {
               if (document.querySelector(".degrees-type").textContent === " ºC") {
                document.querySelector(".degrees-type").textContent = " ºF"
                degrees.textContent = Math.floor(response.current.temp * (9/5) + 32);
               } else {
                document.querySelector(".degrees-type").textContent = " ºC";
                degrees.textContent = response.current.temp;
               }
           })

           // Get the extra info for the cards and forecast
           const wind = document.querySelector(".wind-speed");
           const humidity = document.querySelector(".humidity");
           const uvindex = document.querySelector(".uv-index");
           wind.textContent = `${response.current["wind_speed"]} meter/sec`;
           humidity.textContent = `${response.current.humidity} %`;
           uvindex.textContent = `${response.current.uvi}`;

           // Change the color of uvindex based in its data
           if (uvindex.textContent < 2){
               uvindex.style.color = "green";
           } else if (uvindex.textContent < 5) {
               uvindex.style.color = "yellow";
           } else if (uvindex.textContent < 7) {
               uvindex.style.color = "orange";
           } else if (uvindex.textContent < 10) {
               uvindex.style.color = "red";
           } else {
               uvindex.style.color = "#800080";
           }
           // Forecast for the next 7 days
           for (let i = 1; i < 7; i++) {
               //HTML Elements
               const month = document.getElementById(`month${i}`);
               const day = document.getElementById(`day${i}`);
               const iconForecast = document.getElementById(`forecast-icon${i}`);
               const min = document.getElementById(`min${i}`);
               const max = document.getElementById(`max${i}`);
               
               const datetime = new Date(response.daily[i].dt * 1000);
               const iconCodeForecast = response.daily[i].weather[0].icon;
               const iconUrlForecast = `http://openweathermap.org/img/wn/${iconCodeForecast}@2x.png`;
               iconForecast.src = iconUrlForecast;
               const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
               month.textContent = `${monthArr[datetime.getMonth()]} `;
               day.textContent = `${datetime.getDate()}`;
               min.textContent = `${response.daily[i].temp.min} ºC`;
               max.textContent = `${response.daily[i].temp.max} ºC`;

               
           }
    });
    fetch(url).then(data => data.json()).then(data => {
        loc.textContent = data.name;
    })
    })
};