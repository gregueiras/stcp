import React from 'react'
import { Platform, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'

const HomeStackAux = createStackNavigator()
function HomeStack() {
  return (
    <HomeStackAux.Navigator>
      <HomeStackAux.Screen name="Home" component={HomeScreen} />
    </HomeStackAux.Navigator>
  )
}

const LinksStackAux = createStackNavigator()
function LinksStack() {
  return (
    <LinksStackAux.Navigator>
      <LinksStackAux.Screen name="Links" component={LinksScreen} />
    </LinksStackAux.Navigator>
  )
}

function screenOptions({ route }) {
  return {
    // eslint-disable-next-line react/prop-types
    tabBarIcon: ({ focused }) => {
      let iconName
      switch (route.name) {
        case 'Home':
          iconName =
            Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'
          break

        case 'Links':
          iconName = Platform.OS === 'ios' ? 'ios-link' : 'md-link'
          break

        default:
          break
      }

      return <TabBarIcon name={iconName} focused={focused} />
    },
  }
}

const BottomTab = createBottomTabNavigator()
export default function() {
  return (
    <NavigationContainer>
      <BottomTab.Navigator screenOptions={screenOptions}>
        <BottomTab.Screen name="Home" component={HomeStack} />
        <BottomTab.Screen name="Links" component={LinksStack} />
      </BottomTab.Navigator>
    </NavigationContainer>
  )
}
