var searchButton = document.getElementById('searchButton');
var key = process.env.WEATHER_KEY;
var currentWeatherEL = document.getElementById('currentWeather');

searchButton.addEventListener('click', function() {
  var userCity = document.getElementById('searchBar').value;
  console.log('userCity', userCity);
  getCoordinates(userCity);
});


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