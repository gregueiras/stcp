import React, { Component } from "react";
import MenuCard from "../components/MenuCard";
import { Container, TabsContainer } from "../constants/Styles";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native";
import Styles from "../constants/Styles";
import { loadStops } from "../constants/AuxFunctions";

export default class HomeScreen extends Component {
  state = {
    stopsList: undefined
  };

  async _loadStops() {
    const stops = await loadStops();
    this.setState({ stopsList: stops });
  }

  componentDidMount() {
    this._loadStops();
  }

  renderItem({ item }) {
    return <MenuCard stopCode={item.stop} provider={item.provider} />;
  }

  renderList() {
    if (this.state.stopsList !== undefined) {
      return (
        <FlatList
          style={Styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={this.state.stopsList}
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
  title: "Ementa FEUP"
};
