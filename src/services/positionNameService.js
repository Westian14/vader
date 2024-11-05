//Hämtar namnet på användarens position med hjälp av lat och long
export function getLocationName(position) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${position.lat}+${position.long}&key=6887063a3fc1449faf38383e337eecc8`,
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          reject(response.json())
        }
      })
      .then(data => {
        let locName = data.results[0].formatted
        resolve(locName)
      })
  })
}
