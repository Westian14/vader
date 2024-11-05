//Ger nuvarande väder på vald plats
export function getCurrentWeather(location) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.position.lat}&longitude=${location.position.long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms`,
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          reject(response.json())
        }
      })
      .then(data => {
        resolve(transformData(data))
      })
  })
}
//Transformerar datan från API:et till ett snyggare object
function transformData(raw) {
  let weatherData = {}
  weatherData.weather = []

  let data = {
    date: raw.current.time,
    code: raw.current.weather_code,
    temp: {
      temp: raw.current.temperature_2m,
      unit: raw.current_units.temperature_2m,
      app: raw.current.apparent_temperature,
    },
    precipitation: raw.current.precipitation,
    wind: {
      speed: raw.current.wind_speed_10m,
      direction: raw.current.wind_direction_10m,
      gusts: raw.current.wind_gusts_10m,
    },
    humidity: raw.current.relative_humidity_2m,
    cloud: raw.current.cloud_cover,
    pressure: raw.current.pressure_msl,
  }

  weatherData.weather.push(data)
  return weatherData
}
