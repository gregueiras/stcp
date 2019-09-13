import React, { Component } from 'react'
import { TextInput, View, Alert, AsyncStorage } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-material-dropdown'
import PropTypes from 'prop-types'
import { fetchURL, loadStops } from '../constants/AuxFunctions'
import { PROVIDERS, STOPS_KEY, PROVIDERS_DATA } from '../constants/Strings'
import { LineInfo, Line, Destination, DefaultTheme } from '../constants/Styles'
import SUBWAY_STOPS from '../constants/stops'

export default class LinksScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopsList: undefined,
      newStop: '',
      newProvider: PROVIDERS_DATA[0].value,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener('willBlur', () => {
      this.saveStops()
    })

    this.loadStops()
  }

  componentWillUnmount() {
    this.saveStops()
  }

  renderList = () => {
    const { stopsList } = this.state
    if (stopsList !== undefined) {
      return <FlatList data={stopsList} keyExtractor={item => item.stop} renderItem={this.renderItem} />
    }
    return <></>
  }

  addStop = async () => {
    try {
      const { newProvider, newStop, stopsList } = this.state

      const provider = newProvider
      const stopToAdd = newStop.toUpperCase()

      if (provider === PROVIDERS.METRO) {
        if (
          !SUBWAY_STOPS.includes(
            stopToAdd
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          )
        )
          throw new Error('Invalid Stop')
      }

      const list = stopsList
      if (list.filter(({ stop }) => stop === stopToAdd).length !== 0) {
        // alert('Repeated Stop') TODO: Show toast notification displaying error
        return
      }
      const location = await this.loadLocation({ provider, stop: stopToAdd })

      const newObject = {
        provider,
        stop: stopToAdd,
        coords: location,
      }

      const newList = list.concat(newObject)

      console.log(newObject)
      this.setState({ stopsList: newList, newStop: '' })
    } catch (error) {
      console.log(error)
      Alert.alert('Invalid Stop')
    }
  }

  renderItem = ({ item }) => {
    return (
      <LineInfo style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Line>{item.provider}</Line>
        <Destination>{item.stop}</Destination>
        <TouchableOpacity onPress={() => this.removeStop(item.stop)}>
          <Ionicons name="ios-remove-circle-outline" size={40} />
        </TouchableOpacity>
      </LineInfo>
    )
  }

  handleNewStop = text => {
    this.setState({ newStop: text })
  }

  handlePicker = value => {
    this.state.newProvider = value
  }

  async loadLocation({ provider, stop }) {
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
        const { lat, lon } = await this.findPlace(`metro ${stop}`, true, 1)

        coords.x = lat
        coords.y = lon
      } catch (error) {
        console.error(error)
      }
    }

    return coords
  }

  async saveStops() {
    const { stopsList } = this.state
    await AsyncStorage.setItem(STOPS_KEY, JSON.stringify(stopsList))
  }

  async loadStops() {
    const stops = await loadStops()
    this.setState({ stopsList: stops })
  }

  removeStop(stopToRemove) {
    const { stopsList } = this.state

    const list = stopsList
    const newList = list.filter(({ stop }) => {
      return stop !== stopToRemove
    })

    this.setState({ stopsList: newList })
  }

  render() {
    const { newProvider, newStop } = this.state

    return (
      <ThemeProvider theme={DefaultTheme}>
        <KeyboardAwareScrollView>
          {this.renderList()}
          <View style={{ flexDirection: 'row' }}>
            <Dropdown
              label="Provider"
              data={PROVIDERS_DATA}
              value={newProvider}
              containerStyle={{ width: '25%' }}
              onChangeText={this.handlePicker}
            />
            <TextInput
              style={{ width: '65%', fontSize: 20 }}
              editable
              maxLength={20}
              onChangeText={this.handleNewStop}
              value={newStop}
              placeholder="Insert new stop"
            />
            <TouchableOpacity onPress={this.addStop}>
              <Ionicons name="ios-add" size={40} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ThemeProvider>
    )
  }
}

LinksScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
}
