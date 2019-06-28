import React, { Component } from "react";
import { TextInput, View, Alert } from "react-native";
import { LineInfo, Line, Destination, DefaultTheme } from "../constants/Styles";
import { AsyncStorage } from "react-native";
import { PROVIDERS, STOPS_KEY } from "../constants/Strings";
import { ThemeProvider } from "styled-components";
import {
  FlatList,
  TouchableHighlight,
  TouchableOpacity
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
import { fetchURL } from "../constants/AuxFunctions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class Options extends Component {
  state = {
    stopsList: undefined,
    newStop: ""
  };

  constructor(props) {
    super(props);
  }

  async loadStops() {
    try {
      let stops = JSON.parse(await AsyncStorage.getItem(STOPS_KEY));
      if (stops === null) {
        stops = [
          {
            provider: "STCP",
            stop: "FEUP3",
            coords: {
              x: 41.182,
              y: -8.598
            }
          },
          {
            provider: "STCP",
            stop: "FEUP1",
            coords: {
              x: 41.178,
              y: -8.598
            }
          },
          {
            provider: "STCP",
            stop: "BVLH1",
            coords: {
              x: 41.16842,
              y: -8.62041
            }
          }
        ];
      }

      this.setState({ stopsList: stops });
    } catch (error) {
      console.log("ERRO");
      console.log(error);
    }
  }

  async loadLocation({ provider, stop }) {
    if (provider === PROVIDERS.STCP) {
      const url =
        "https://www.stcp.pt/pt/itinerarium/callservice.php?action=srchstoplines&stopcode=" +
        stop;
      const res = JSON.parse(await fetchURL(url))[0].geomdesc;
      const coordinates = JSON.parse(res).coordinates;

      const coords = {
        x: coordinates[0],
        y: coordinates[1]
      };

      return coords;
    }
  }

  async saveStops() {
    await AsyncStorage.setItem(STOPS_KEY, JSON.stringify(this.state.stopsList));
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("willBlur", () => {
      this.saveStops();
    });

    this.loadStops();
  }

  componentWillUnmount() {
    console.log("Will Unmount");
  }

  renderList = () => {
    if (this.state.stopsList !== undefined) {
      return (
        <FlatList
          data={this.state.stopsList}
          keyExtractor={item => item.stop}
          renderItem={this.renderItem}
        />
      );
    }
  };

  removeStop(stopToRemove) {
    const list = this.state.stopsList;
    const newList = list.filter(({ stop }) => {
      return stop != stopToRemove;
    });

    this.setState({ stopsList: newList });

    console.log(newList);
    console.log(stopToRemove);
  }

  async addStop(provider, stopToAdd) {
    try {
      const list = this.state.stopsList;
      if (list.filter(({ stop }) => stop === stopToAdd).length !== 0) {
        alert("Repeated Stop");
        return;
      }
      const location = await this.loadLocation({ provider, stop: stopToAdd });

      const newList = list.concat({
        provider,
        stop: stopToAdd,
        coords: location
      });

      this.setState({ stopsList: newList });
    } catch (error) {
      console.log(error);
      Alert.alert("Invalid Stop");
    }
  }

  renderItem = ({ item }) => {
    return (
      <LineInfo style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Line>{item.provider}</Line>
        <Destination>{item.stop}</Destination>
        <TouchableOpacity onPress={() => this.removeStop(item.stop)}>
          <Icon name="ios-remove-circle-outline" size={40} />
        </TouchableOpacity>
      </LineInfo>
    );
  };

  _handleNewStop = text => {
    this.setState({ newStop: text });
  };

  render() {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <KeyboardAwareScrollView>
          {this.renderList()}
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={{ width: "91%", paddingLeft: 3, fontSize: 20 }}
              editable={true}
              maxLength={20}
              onChangeText={this._handleNewStop}
              placeholder="Insert new stop"
            />
            <TouchableOpacity
              onPress={() => this.addStop("STCP", this.state.newStop)}
            >
              <Icon name="ios-add" size={40} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ThemeProvider>
    );
  }
}

export default withNavigation(Options);
