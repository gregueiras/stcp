import React, { Component } from 'react'
import { Notifications } from 'expo'
import PropTypes from 'prop-types'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { ThemeProvider } from 'styled-components'
import { RefreshControl, ActivityIndicator } from 'react-native'
import { TabItem, LineInfo, TabHeader, Line, Destination, Time, DefaultTheme, TabHeaderText } from '../constants/Styles'
// eslint-disable-next-line import/named
import { tintColor } from '../constants/Colors'

const BACKEND_API = 'https://stcp-backend.herokuapp.com'

function renderLine({ item: { line, destination, time } }, { stopCode, provider }) {
  const subscribeAlert = async () => {
    const token = await Notifications.getExpoPushTokenAsync()

    fetch(BACKEND_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        expire: time,
        lines: [line],
        stopCode,
        provider,
      }),
    })

    console.log(line, stopCode, provider)
  }

  return (
    <TouchableOpacity onPress={subscribeAlert}>
      <LineInfo>
        <Line>{line}</Line>
        <Destination>{destination}</Destination>
        <Time>{time}</Time>
      </LineInfo>
    </TouchableOpacity>
  )
}

export default class StopCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: undefined,
      refreshing: false,
      loading: true,
    }
  }

  componentDidMount() {
    const { stopCode } = this.props
    if (stopCode !== 'STOP') this.loadMenu()
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadMenu().then(() => {
      this.setState({ refreshing: false })
    })
  }

  async loadMenu() {
    try {
      const { provider: tempProvider, stopCode } = this.props
      const provider = tempProvider.replace(/ /g, '+').toUpperCase()
      const stop = stopCode.replace(/ /g, '+')

      const searchUrl = `http://www.move-me.mobi/NextArrivals/GetScheds?providerName=${provider}&stopCode=${provider}_${stop}`

      const response = await fetch(searchUrl) // fetch page
      const text = await response.text() // get response text
      const json = JSON.parse(text) // get response text

      const info = json
        .map(({ Value }) => Value)
        .map(([line, destination, time]) => {
          return {
            line,
            destination,
            time,
            id: `${line}_${time}_${destination}_${Math.random()}`,
          }
        })

      this.setState({ list: info, loading: false })
    } catch (error) {
      console.log('ERROR')
      console.log(error)
      this.setState({ list: 'error' })
    }
  }

  render() {
    const unsubscribeAlert = async () => {
      const token = await Notifications.getExpoPushTokenAsync()

      console.log('unsubscribe')

      fetch(`${BACKEND_API}/unsubscribe`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      })
    }

    const { list, loading, refreshing } = this.state
    const { stopCode } = this.props

    return (
      <ThemeProvider theme={DefaultTheme}>
        <TabItem>
          <TabHeader adjustsFontSizeToFit>
            <TouchableOpacity onPress={unsubscribeAlert}>
              <TabHeaderText>{stopCode}</TabHeaderText>
            </TouchableOpacity>
          </TabHeader>
          {list && loading && <ActivityIndicator size="small" color={tintColor} />}
          {list && !loading && (
            <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}
              data={list}
              keyExtractor={item => item.id}
              renderItem={item => renderLine(item, this.props)}
            />
          )}
        </TabItem>
      </ThemeProvider>
    )
  }
}

StopCard.defaultProps = {
  stopCode: 'STOP',
  provider: 'STCP',
}

StopCard.propTypes = {
  stopCode: PropTypes.string,
  provider: PropTypes.string,
}

renderLine.propTypes = {
  item: PropTypes.arrayOf(
    PropTypes.shape({
      line: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }),
  ).isRequired,
}
