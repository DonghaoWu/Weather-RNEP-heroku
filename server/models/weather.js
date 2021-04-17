const request = require('request-promise');

class Weather {
  static retrieveByCity({ city }) {
    return new Promise(async (resolve, reject) => {
      try {
        const weather = await request({
          uri: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.WEATHER_API}&units=imperial`,
          json: true
        });
        resolve({ weather });
      } catch (err) {
        reject(err.error)
      }
    })
  }
}

module.exports = Weather;