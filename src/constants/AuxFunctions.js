import { PROVIDERS } from './Strings'
import store from '../redux'
import SUBWAY_STOPS from './stops'

export async function fetchURL(searchUrl) {
  const response = await fetch(searchUrl) // fetch page
  const text = await response.text() // get response text

  return text
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

async function loadLocation({ provider, stop }) {
  const coords = {
    x: 0,
    y: 0,
  }

  if (provider === PROVIDERS.STCP) {
    const url = `https://www.stcp.pt/pt/itinerarium/callservice.php?action=srchstoplines&stopcode=${stop}`
    const res = JSON.parse(await fetchURL(url))[0].geomdesc
    const { coordinates } = JSON.parse(res)

    ;[coords.y, coords.x] = coordinates
  } else if (provider === PROVIDERS.METRO) {
    try {
      const { lat, lon } = await findPlace(`metro ${stop}`, true, 1)

      coords.x = lat
      coords.y = lon
    } catch (error) {
      console.error(error)
    }
  }

  return coords
}

export async function validateStop(provider, stopToAdd) {
  const { stops } = store.getState()

  if (provider === PROVIDERS.METRO) {
    if (
      !SUBWAY_STOPS.includes(
        stopToAdd
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      )
    )
      throw new Error(`This stop doesn't exit`)
  }

  if (stops.filter(({ stop }) => stop === stopToAdd).length !== 0) {
    throw new Error('Repeated Stop')
  }
  const location = await loadLocation({ provider, stop: stopToAdd })

  return {
    provider,
    stop: stopToAdd,
    coords: location,
  }
}
