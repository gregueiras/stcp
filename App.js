/* eslint-disable react/jsx-filename-extension */
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import React, { useState } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Provider as PaperProvider } from 'react-native-paper'
import PropTypes from 'prop-types'
import AppNavigator from './navigation/AppNavigator'

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      ...Ionicons.font,
    }),
  ])
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error)
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const { skipLoadingScreen } = props

  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    )
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <AppNavigator />
      </View>
    </PaperProvider>
  )
}

App.propTypes = {
  skipLoadingScreen: PropTypes.bool,
}

App.defaultProps = {
  skipLoadingScreen: false,
}
