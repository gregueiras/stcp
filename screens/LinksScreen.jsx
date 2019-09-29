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
import Modal from '../components/Modal'

export default class LinksScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopsList: [],
      newStop: '',
      newProvider: PROVIDERS_DATA[0].value,
      modalShowing: false,
      stopToEdit: undefined,
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

  getFavName(stopCode) {
    let ret = ''
    const { stopsList } = this.state
    stopsList.forEach(({ favName, stop }) => {
      if (stop === stopCode) {
        ret = favName
      }
    })

    return ret
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

      this.setState({ stopsList: newList, newStop: '' })
    } catch (error) {
      console.log(error)
      Alert.alert('Invalid Stop')
    }
  }

  renderItem = ({ item }) => {
    const { stop, provider, favName } = item

    return (
      <LineInfo style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Line style={{ paddingTop: 7 }}>{provider}</Line>
        <Destination style={{ paddingTop: 7 }}>{favName ? `${favName} (${stop})` : stop}</Destination>
        <TouchableOpacity
          onPress={() => this.setState({ modalShowing: true, stopToEdit: stop })}
          style={{ marginRight: '4%' }}
        >
          <Ionicons name="ios-build" size={36} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.removeStop(stop)}>
          <Ionicons name="ios-remove-circle-outline" size={40} />
        </TouchableOpacity>
      </LineInfo>
    )
  }

  handleNewStop = newStop => {
    this.setState({ newStop })
  }

  handlePicker = newProvider => {
    this.setState({ newProvider })
  }

  editStop = modalStop => {
    const { stopsList, stopToEdit } = this.state

    const newList = stopsList.map(entry => {
      const { stop } = entry
      if (stop === stopToEdit) {
        return { ...entry, favName: modalStop === '' ? undefined : modalStop }
      }

      return entry
    })

    this.setState({ stopsList: newList })
  }

  removeStop(stopToRemove) {
    const { stopsList } = this.state

    const newList = stopsList.filter(({ stop }) => {
      return stop !== stopToRemove
    })

    this.setState({ stopsList: newList })
  }

  async loadStops() {
    const stops = await loadStops()
    this.setState({ stopsList: stops })
  }

  async saveStops() {
    const { stopsList } = this.state
    await AsyncStorage.setItem(STOPS_KEY, JSON.stringify(stopsList))
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

  render() {
    const { newProvider, newStop, modalShowing, stopToEdit } = this.state

    return (
      <ThemeProvider theme={DefaultTheme}>
        <KeyboardAwareScrollView>
          {this.renderList()}
          <View style={{ flexDirection: 'row' }}>
            <Modal
              toggleModal={() => this.setState({ modalShowing: !modalShowing })}
              onSubmit={this.editStop}
              modalShowing={modalShowing}
              getOldFavName={() => this.getFavName(stopToEdit)}
            />
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
