var searchButton = document.getElementById('searchButton');
import key from '../token.js';
var currentWeatherEl = document.getElementById('currentWeather');

searchButton.addEventListener('click', function() {
  var userCity = document.getElementById('searchBar').value;
  console.log('userCity', userCity);
  getCoordinates(userCity);
});

function getCurrent(data) {
  console.log('data inside getCurrent', data);
  var lat = data[0].lat;
  var lon = data[0].lon;
  var requestCityCurrent = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;

  fetch(requestCityCurrent)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('data', data);

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

function getForecast(data) {
  console.log('data inside getForecast', data);
  var lat = data[0].lat;
  var lon = data[0].lon;
  var requestCity = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('data', data);
      console.log('temp', data.list[0].main.temp);
    });
}

function getCoordinates(userCity) {
  var requestCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${userCity}&limit=5&appid=${key}`;

  fetch(requestCoordinates)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // getForecast(data);
      getCurrent(data);
    });
};