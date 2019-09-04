import React, { Component } from "react";
import StopCard from "../components/StopCard";
import Styles, { Container } from "../constants/Styles";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native";
import { loadStops, distance } from "../constants/AuxFunctions";

export default class HomeScreen extends Component {
  state = {
    stopsList: undefined,
    location: undefined,
  };

  async _loadStops() {
    const stops = await loadStops();
    this.setState({ stopsList: stops });
  }

  _updateLocation = (position) => {
    try {
      const { coords } = position;
      const { latitude, longitude } = coords;

      console.log(position)
      this.setState({ location: { lat: latitude, lon: longitude } });
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this._updateLocation);
    const { navigation } = this.props;
    this._loadStops();

    this.focusListener = navigation.addListener("didFocus", () => {
      this._loadStops();
      setTimeout(() => this._loadStops(), 50);
    });
  }

  renderItem({ item }) {
    return <StopCard stopCode={item.stop} provider={item.provider} />;
  }

  getSortedList() {
    const {location} = this.state
    const sortedList = this.state.stopsList.sort(({ coords: cA }, { coords: cB }) => {
        return distance(location, cA) - distance(location, cB);
    });
    
    console.log(sortedList.map(({stop, coords}) => [stop, distance(location, coords)]))

    return sortedList
  }

  renderList() {
    if (this.state.stopsList !== undefined && this.state.stopsList.length !== 0) {
      const stops = (this.state.location === undefined) ? this.state.stopsList : this.getSortedList()

      return (
        <FlatList
          style={Styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={stops}
          keyExtractor={({ stop, provider }) => stop + "_" + provider}
          renderItem={this.renderItem}
        />
      );
    } else {
      return <Text style={Styles.getStartedText}>Add some stops! 😊</Text>;
    }
  }

  render() {
    return <Container>{this.renderList()}</Container>;
  }
}

HomeScreen.navigationOptions = {
  title: "Stops"
};
