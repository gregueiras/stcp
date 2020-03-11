import React, { Component } from 'react'
import { Text, RefreshControl, ScrollView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'
import StopCard from '../components/StopCard'
import Styles, { Container } from '../constants/Styles'
import { distance } from '../constants/AuxFunctions'
import { getStops } from '../constants/Storage'

function renderStopCard({ item }) {
  const { stop, provider, favName } = item

  return <StopCard stopCode={stop} displayName={favName || stop} provider={provider} />
}

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { location: undefined, stopsList: undefined, refreshing: undefined }
  }

  componentDidMount() {
    this.updateLocation()
  }

  getSortedList() {
    const { location, stopsList } = this.state
    if (location) {
      const sortedList = stopsList.sort(({ coords: cA }, { coords: cB }) => {
        return distance(location, cA) - distance(location, cB)
      })
      return sortedList
    }

    return undefined
  }

  onRefresh = async () => {
    this.updateLocation()
    setTimeout(() => this.setState({ refreshing: false }), 60)
  }

  setLocation = position => {
    try {
      const { coords } = position
      const { latitude, longitude } = coords

      this.setState({ location: { lat: latitude, lon: longitude } })
    } catch (error) {
      console.log(error)
    }
  }

  updateLocation() {
    navigator.geolocation.getCurrentPosition(this.setLocation)
    const { navigation } = this.props
    this.loadStops()

    this.focusListener = navigation.addListener('didFocus', () => {
      this.loadStops()
      setTimeout(() => this.loadStops(), 50)
    })
  }

  async loadStops() {
    const stops = await getStops()
    this.setState({ stopsList: stops })
  }

  renderList() {
    const { location, stopsList } = this.state

    if (stopsList !== undefined && stopsList.length !== 0) {
      const stops = location === undefined ? stopsList : this.getSortedList()

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

  render() {
    const { refreshing } = this.state

    return (
      <Container>
        <ScrollView
          refreshControl={<RefreshControl tintColor="#000" refreshing={refreshing} onRefresh={this.onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, alignSelf: 'center', margin: 'auto' }}
        >
          {this.renderList()}
        </ScrollView>
      </Container>
    )
  }
}

HomeScreen.navigationOptions = {
  title: 'Stops',
}

HomeScreen.defaultState = {
  stopsList: undefined,
  location: undefined,
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
}

renderStopCard.propTypes = {
  item: PropTypes.shape({
    stop: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    favName: PropTypes.string,
  }).isRequired,
}
