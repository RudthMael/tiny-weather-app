app.service('Cities', function($http, $q) {
  // Cache for city forecasts and current weather
  var cityWeatherData = {};
  var cityForecastData = {};

  var service = {
    /**
     * Returns a promise to an array of cities fetched from the file
     * /data/cities-fr.json
     * @return {Promise}
     */
    getAll: function() {
      return $http.get('/data/cities-fr.json');
    },

    /**
     * Returns the forecast for a city
     * @param {String} cityId
     * @return {Promise}
     */
    getForecast: function(cityId) {
      if (cityForecastData[cityId]) {
        return $q.when(cityForecastData[cityId]);
      }

      return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?id='
                        + cityId + '&appid=47d1014bdfe106cc7d9594558f95073f&units=metric&cnt=3').then(function(response) {
                          // Store the value found in cache
                          cityForecastData[cityId] = _.map(response.data.list, function(data, i) {
                            return {
                              iconId: data.weather[0].id,
                              temperatureMin: data.temp.min,
                              temperatureMax: data.temp.max,
                              day: moment(Date.now()).add(i + 1, 'days').format('ddd')
                            };
                          });

                          return cityForecastData[cityId];
                        });
    },

    /**
     * Returns the current weather for a city
     * @param  {[type]} cityId [description]
     * @return {[type]}        [description]
     */
    getCurrentWeather: function(cityId) {
      if (cityWeatherData[cityId]) {
        return $q.when(cityWeatherData[cityId]);
      }

      return $http.get('http://api.openweathermap.org/data/2.5/weather?id='
                        + cityId + '&appid=47d1014bdfe106cc7d9594558f95073f&units=metric').then(function(response) {
                          // Store the value found in cache
                          cityWeatherData[cityId] = {
                            iconId: response.data.weather[0].id,
                            temperature: response.data.main.temp
                          };

                          return cityWeatherData[cityId];
                        });
    }
  };

  return service
});
