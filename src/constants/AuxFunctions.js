import { AsyncStorage } from 'react-native'
import { STOPS_KEY } from './Strings'

export async function fetchURL(searchUrl) {
  const response = await fetch(searchUrl) // fetch page
  const text = await response.text() // get response text

  return text
}

export async function loadStops() {
  try {
    let stops = JSON.parse(await AsyncStorage.getItem(STOPS_KEY))
    if (stops === null) {
      stops = [
        {
          provider: 'STCP',
          stop: 'FEUP3',
          coords: {
            x: 41.182,
            y: -8.598,
          },
        },
        {
          provider: 'STCP',
          stop: 'FEUP1',
          coords: {
            x: 41.178,
            y: -8.598,
          },
        },
        {
          provider: 'STCP',
          stop: 'BVLH1',
          coords: {
            x: 41.16842,
            y: -8.62041,
          },
        },
      ]
    }

    return stops
  } catch (error) {
    console.log('ERROR')
    console.log(error)
    return []
  }
}

export function distance({ lat, lon }, { x, y }) {
  const toRadians = number => {
    return (number * Math.PI) / 180
  }

  const R = 6371e3 // metres
  const φ1 = toRadians(lat)
  const φ2 = toRadians(x)
  const Δφ = toRadians(x - lat)
  const Δλ = toRadians(y - lon)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export async function findPlace(query, autocomplete, maxResults) {
  const apiUrl =
    `https://api.tomtom.com/search/2/poiSearch/${encodeURIComponent(query)}.JSON?key=` +
    `3NzwzZQK1ZXxP1DJE7q1ihbEOQ9GogJM` +
    `&typeahead=${autocomplete}&limit=${maxResults}&countrySet=PT` +
    `&lat=` +
    `41.14961` +
    `&lon=` +
    `-8.61099`

  const placeResults = await fetch(apiUrl)
    .then(resp => resp.json())
    .then(resp => {
      try {
        const { results } = resp

        return results.map(val => {
          if ('poi' in val) {
            return {
              name: val.poi.name,
              address: val.address.freeformAddress,
              lat: val.position.lat,
              lon: val.position.lon,
            }
          }
          return {
            name: val.address.freeformAddress,
            address: val.address.freeformAddress,
            lat: val.position.lat,
            lon: val.position.lon,
          }
        })
      } catch (error) {
        return []
      }
    })
  return placeResults[0]
}
