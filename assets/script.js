import TOKEN from '../token.js';

var searchButton = document.getElementById('searchButton');
var clearButton = document.getElementById('clearButton');
var cityList = document.querySelector('.list-group');
var currentWeatherEl = document.getElementById('currentWeather');
var forecastWeatherEl = document.getElementById('forecastWeather');
var forecastTitleEl = document.getElementById('forecastWeatherTitle');
var searchHistoryEl = document.getElementById('searchHistory');
var userCity; 
var cityName= '';
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) ? JSON.parse(localStorage.getItem('searchHistory')) : [];

displaySearchHistory();

searchButton.addEventListener('click', function() {
  userCity = document.getElementById('searchBar').value;
  getCoordinates(userCity);
  getAndSetSearchHistory(userCity);
});

clearButton.addEventListener('click', function() {
  localStorage.removeItem('searchHistory');
  location.reload();
})

cityList.addEventListener('click', event => {
  userCity = event.target.textContent;
  getCoordinates(userCity);
  getAndSetSearchHistory(userCity);
});
 
function getAndSetSearchHistory(userCity) {
  if (!searchHistory.includes(userCity)) {
    searchHistory.push(userCity);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  displaySearchHistory(searchHistory);
}

function displaySearchHistory() {
  removeSearchHistory();
  searchHistory.forEach(city => {
    var liEl = document.createElement('li');
    liEl.textContent = city;
    liEl.setAttribute('class', 'list-group-item');
    searchHistoryEl.append(liEl);
  });
}

function removeSearchHistory() {
  while (searchHistoryEl.firstChild) {
    searchHistoryEl.removeChild(searchHistoryEl.lastChild);
  }
}

function getCoordinates(userCity) {
  var requestCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${userCity}&limit=5&appid=${TOKEN}`;

  fetch(requestCoordinates)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getForecast(data);
      getCurrent(data);
    });
};

function getCurrent(data) {
  var lat = data[0].lat;
  var lon = data[0].lon;
  cityName = data[0].name;
  var requestCityCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${TOKEN}&units=imperial`;

  fetch(requestCityCurrent)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeatherEl.innerHTML = '';

      var userCityEl = document.createElement('h2');
      var day = new Date(data.dt * 1000);
      userCityEl.textContent = cityName + ' (' + day.toDateString() + ')';
      currentWeatherEl.appendChild(userCityEl);

      var currentTempEl = document.createElement('p');
      currentTempEl.textContent = 'Current Temp: ' + data.main.temp + '°F';
      currentWeatherEl.appendChild(currentTempEl);

      var currentWindEl = document.createElement('p');
      currentWindEl.textContent = 'Current Wind Speed: ' + data.wind.speed + ' mph';
      currentWeatherEl.appendChild(currentWindEl);

      var currentHumidityEl = document.createElement('p');
      currentHumidityEl.textContent = 'Current Humidity: ' + data.main.humidity + '%';
      currentWeatherEl.appendChild(currentHumidityEl);

      var weatherImgEl = document.createElement('img');
      weatherImgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
      currentWeatherEl.appendChild(weatherImgEl);
    });
}

function getForecast(data) {
  var lat = data[0].lat;
  var lon = data[0].lon;
  var requestCity = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${TOKEN}&units=imperial`;

  fetch(requestCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastWeatherEl.innerHTML= '';
      forecastTitleEl.textContent = '';
      
      var fiveDayForecastTitle = document.createElement('h3');
      fiveDayForecastTitle.textContent = '5-Day Forecast:';
      forecastTitleEl.appendChild(fiveDayForecastTitle);

      for (var i=0; i < 5; i++) {
        var forecastCards = document.createElement('div');
        forecastCards.setAttribute('class', 'card forecastcard');
        var cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');
      
        var dateEl = document.createElement('h3');
        dateEl.setAttribute('class', 'card-title');
        var forDT = i*8+5;
        var day = new Date(data.list[forDT].dt*1000);
        dateEl.textContent = day.toDateString();
        var span = document.createElement('span');

        var forecastTempEl = document.createElement('p');
        forecastTempEl.textContent = 'Current Temp: ' + data.list[i].main.temp + '°F';

        var forecastWindEl = document.createElement('p');
        forecastWindEl.textContent = 'Wind: ' + data.list[i].wind.speed + 'mph';

        var forecastHumidityEl = document.createElement('p');
        forecastHumidityEl.textContent = 'Humidity: ' + data.list[i].main.humidity + '%';

        var forecastWeatherImgEl = document.createElement('img');
        forecastWeatherImgEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);
        span.append(forecastWeatherImgEl);
        dateEl.append(span);
        cardBody.append(dateEl, forecastTempEl, forecastWindEl, forecastHumidityEl);
        forecastCards.append(cardBody);
        forecastWeatherEl.append(forecastCards);  
      }
    });
}
