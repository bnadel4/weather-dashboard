var searchButton = document.getElementById('searchButton');
var key = process.env.WEATHER_KEY;
var currentWeatherEL = document.getElementById('currentWeather');

searchButton.addEventListener('click', function() {
  var userCity = document.getElementById('searchBar').value;
  console.log('userCity', userCity);
  getCoordinates(userCity);
});


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
      getForecast(data);
      getCurrent(data);
    });
};