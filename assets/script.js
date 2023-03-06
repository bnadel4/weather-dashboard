import TOKEN from '../token.js';

var searchButton = document.getElementById('searchButton');
var currentWeatherEl = document.getElementById('currentWeather');
var forecastWeatherEl = document.getElementById('forecastWeather');
var userCity; 

searchButton.addEventListener('click', function() {
  userCity = document.getElementById('searchBar').value;
  getCoordinates(userCity);
});

function getCurrent(data) {
  console.log('data inside getCurrent', data);
  var lat = data[0].lat;
  var lon = data[0].lon;
  var requestCityCurrent = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${TOKEN}&units=imperial`;

  fetch(requestCityCurrent)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var userCityEl = document.createElement('h2');
      userCityEl.textContent = userCity;
      currentWeatherEl.appendChild(userCityEl);

      var currentTempEl = document.createElement('p');
      currentTempEl.textContent = 'Current Temp: ' + data.main.temp;
      currentWeatherEl.appendChild(currentTempEl);

      var currentWindEl = document.createElement('p');
      currentWindEl.textContent = 'Current Wind Speed: ' + data.wind.speed;
      currentWeatherEl.appendChild(currentWindEl);

      var currentHumidityEl = document.createElement('p');
      currentHumidityEl.textContent = 'Current Humidity: ' + data.main.humidity;
      currentWeatherEl.appendChild(currentHumidityEl);

      var weatherImgEl = document.createElement('img');
      weatherImgEl.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      currentWeatherEl.appendChild(weatherImgEl);
    });
}


function getCoordinates(userCity) {
  var requestCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${userCity}&limit=5&appid=${TOKEN}`;

  fetch(requestCoordinates)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getForecast(data);
      // getCurrent(data);
    });
};

function getForecast(data) {
  var lat = data[0].lat;
  var lon = data[0].lon;
  var requestCity = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${TOKEN}&units=imperial`;

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('5 day forecast data', data);
      console.log('city name', data.city.name);
      console.log('temp', data.list[0].main.temp);
      console.log('wind', data.list[0].wind.speed);
      console.log('humidity', data.list[0].main.humidity);
      console.log('icon code', data.list[0].weather[0].icon);

      var forecastNameEl = document.createElement('h2');
      forecastNameEl.textContent = data.city.name;
      forecastWeatherEl.appendChild(forecastNameEl);

      var forecastTempEl = document.createElement('p');
      forecastTempEl.textContent = 'Current Temp: ' + data.list[0].main.temp;
      forecastWeatherEl.appendChild(forecastTempEl);

      var forecastWindEl = document.createElement('p');
      forecastWindEl.textContent = 'Wind: ' + data.list[0].wind.speed + 'mph';
      forecastWeatherEl.appendChild(forecastWindEl);

      var forecastHumidityEl = document.createElement('p');
      forecastHumidityEl.textContent = 'Humidity: ' + data.list[0].main.humidity + '%';
      forecastWeatherEl.appendChild(forecastHumidityEl);
    });
}
