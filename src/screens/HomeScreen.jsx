import React, { useState, useEffect } from 'react'
import { Text, RefreshControl, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import StopCard from '../components/StopCard'
import Styles, { Container } from '../constants/Styles'
import { distance } from '../constants/AuxFunctions'
import { creators } from '../redux/ducks/stops'

const { loadStopsSuccess, loadStops } = creators

function renderStopCard({ item }) {
  const { stop, provider, favName } = item

  return <StopCard stopCode={stop} displayName={favName || stop} provider={provider} />
}

export default function HomeScreen() {
  const dispatch = useDispatch()
  const stopsList = useSelector(state => state.stops)
  const [location, setLocation] = useState()
  const [refreshing, setRefreshing] = useState()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    watchLocation()
    dispatch(loadStops())
  }, [])

  useEffect(() => {
    const sorted = getSortedList()
    if (sorted) {
      dispatch(loadStopsSuccess(sorted))
    }
    setRefreshing(false)
  }, [location])

  const getSortedList = () => {
    if (location) {
      const sortedList = stopsList.sort(({ coords: cA }, { coords: cB }) => {
        return distance(location, cA) - distance(location, cB)
      })
      return sortedList
    }

    return stopsList
  }

  const updateLocation = position => {
    const { coords } = position
    const { latitude, longitude } = coords

    setLocation({ lat: latitude, lon: longitude })
  }

  const watchLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 1000 * 5, distanceInterval: 30 },
        updateLocation,
      )
    } else {
      setErrorMessage('Permission to access location was denied')
    }
  }

  const manualUpdateLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      const position = await Location.getCurrentPositionAsync({})
      updateLocation(position)
    } else {
      setErrorMessage('Permission to access location was denied')
    }
  }

  const renderList = () => {
    if (stopsList.length !== 0) {
      const stops = location === undefined ? stopsList : getSortedList()

      return (
        <FlatList
          style={Styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={stops}
          keyExtractor={({ stop, provider }) => `${stop}_${provider}`}
          renderItem={renderStopCard}
        />
      )
    }
    return <Text style={Styles.getStartedText}>Add some stops! 😊</Text>
  }

  return (
    <Container>
      {errorMessage !== '' && <Text style={Styles.getStartedText}>{errorMessage}</Text>}
      {errorMessage === '' && (
        <ScrollView
          refreshControl={<RefreshControl tintColor="#000" refreshing={refreshing} onRefresh={manualUpdateLocation} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, alignSelf: 'center', margin: 'auto' }}
        >
          {renderList()}
        </ScrollView>
      )}
    </Container>
  )
}

renderStopCard.propTypes = {
  item: PropTypes.shape({
    stop: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    favName: PropTypes.string,
  }).isRequired,
}
