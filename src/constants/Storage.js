import { AsyncStorage } from 'react-native'
import { STOPS_KEY } from './Strings'

export async function getStops() {
  try {
    return JSON.parse(await AsyncStorage.getItem(STOPS_KEY))
  } catch (error) {
    return []
  }
}

export async function setStops(stopsList) {
  await AsyncStorage.setItem(STOPS_KEY, JSON.stringify(stopsList))
}
