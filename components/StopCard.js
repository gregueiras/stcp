import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  TabItem,
  LineInfo,
  TabHeader,
  Line,
  Destination,
  Time,
  DefaultTheme,
  TabHeaderText
} from "../constants/Styles";
import { FlatList } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components";
import { RefreshControl, ActivityIndicator } from "react-native";
import tintColor from "../constants/Colors";

export default class StopCard extends Component {
  state = {
    list: undefined,
    refreshing: false,
    loading: true
  };

  async loadMenu() {
    try {
      const provider = this.props.provider.replace(/ /g, "+").toUpperCase();
      const stop = this.props.stopCode.replace(/ /g, "+");

      const searchUrl = `http://www.move-me.mobi/NextArrivals/GetScheds?providerName=${provider}&stopCode=${provider}_${stop}`;

      const response = await fetch(searchUrl); // fetch page
      const text = await response.text(); // get response text
      const json = JSON.parse(text); // get response text

      const info = json
        .map(({ Value }) => Value)
        .map(([line, destination, time]) => {
          return {
            line,
            destination,
            time,
            id: line + "_" + time + "_" + destination + "_" + Math.random()
          };
        });

      this.setState({ list: info, loading: false });
    } catch (error) {
      console.log("ERRO");
      console.log(error);
      this.setState({ list: "error" });
    }
  }

  componentDidMount() {
    if (this.props.stopCode !== "STOP") this.loadMenu();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadMenu().then(() => {
      this.setState({ refreshing: false });
    });
  };

  renderList() {
    if (this.state.list !== undefined) {
      if (this.state.loading) {
        return <ActivityIndicator size="small" color={tintColor} />;
      } else {
        return (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            data={this.state.list}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />
        );
      }
    }
  }

  renderItem({ item }) {
    return (
      <LineInfo>
        <Line>{item.line}</Line>
        <Destination>{item.destination}</Destination>
        <Time>{item.time}</Time>
      </LineInfo>
    );
  }

  render() {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <TabItem>
          <TabHeader adjustsFontSizeToFit>
            <TabHeaderText>{this.props.stopCode}</TabHeaderText>
          </TabHeader>
          {this.renderList()}
        </TabItem>
      </ThemeProvider>
    );
  }
}

StopCard.defaultProps = {
  stopCode: "STOP",
  provider: "STCP"
};

StopCard.propTypes = {
  stopCode: PropTypes.string,
  provider: PropTypes.string
};
