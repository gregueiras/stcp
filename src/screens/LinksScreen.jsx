/* eslint-disable no-restricted-syntax, no-use-before-define, react/prop-types */
import React, { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { Dropdown } from 'react-native-material-dropdown'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { TextInput, ActivityIndicator } from 'react-native-paper'
import { validateStop } from '../constants/AuxFunctions'
import { PROVIDERS_DATA } from '../constants/Strings'
import { LineInfo, Line, Destination, DefaultTheme } from '../constants/Styles'
import Modal from '../components/Modal'

import { creators } from '../redux/ducks/stops'

const { addStop, removeStop, editStop, loadStops } = creators

export default function LinksScreen({ navigation }) {
  const dispatch = useDispatch()
  const stopsList = useSelector(state => state.stops)
  const [newStop, setNewStop] = useState('')
  const [newProvider, setNewProvider] = useState(PROVIDERS_DATA[0].value)
  const [showModal, setShowModal] = useState(false)
  const [stopToEdit, setStopToEdit] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(loadStops())
  }, [])

  function getFavName(stopCode) {
    for (const { favName, stop } of stopsList) {
      if (stop === stopCode) {
        return favName
      }
    }
    return stopCode
  }

  async function addStopHandler() {
    if (!newStop) return
    try {
      setLoading(true)
      const stop = await validateStop(newProvider, newStop.toUpperCase())

      dispatch(addStop(stop))
      setNewStop('')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Alert.alert(error.message)
    }
  }

  function renderItem({ item }) {
    const { stop, provider, favName } = item

    return (
      <LineInfo style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Line style={{ paddingTop: 7 }}>{provider}</Line>
        <Destination style={{ paddingTop: 7 }}>{favName ? `${favName} (${stop})` : stop}</Destination>
        <TouchableOpacity
          onPress={() => {
            setShowModal(true)
            setStopToEdit(stop)
          }}
          style={{ marginRight: '4%' }}
        >
          <Ionicons name="ios-build" size={36} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(removeStop({ stop, provider }))}>
          <Ionicons name="ios-remove-circle-outline" size={40} />
        </TouchableOpacity>
      </LineInfo>
    )
  }

  function handlePicker(provider) {
    setNewProvider(provider)
  }

  return (
    <ThemeProvider theme={DefaultTheme}>
      <View>
        {stopsList.length === 0 && <ActivityIndicator />}
        {stopsList.length > 0 && (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Modal
                toggleModal={() => setShowModal(!showModal)}
                onSubmit={modalStop => dispatch(editStop(stopToEdit, modalStop))}
                modalShowing={showModal}
                getOldFavName={() => getFavName(stopToEdit)}
              />
              <Dropdown
                label="Provider"
                disabled={loading}
                data={PROVIDERS_DATA}
                value={newProvider}
                containerStyle={{ width: '25%' }}
                onChangeText={handlePicker}
              />
              <TextInput
                style={{ width: '65%', fontSize: 20 }}
                disabled={loading}
                maxLength={20}
                value={newStop}
                onSubmitEditing={addStopHandler}
                placeholder="Insert new stop"
              />
              <TouchableOpacity disabled={loading} onPress={addStopHandler}>
                <Ionicons name="ios-add" size={40} />
              </TouchableOpacity>
            </View>
            <FlatList data={stopsList} keyExtractor={item => item.stop} renderItem={renderItem} />
          </View>
        )}
      </View>
    </ThemeProvider>
  )
}

LinksScreen.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
}
