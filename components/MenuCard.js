import React, { Component } from "react";
import { Text } from "react-native";
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

export default class MenuCard extends Component {
  state = {
    title: "FEUP",
    list: undefined
  };

  async loadMenu() {
    try {
      const searchUrl =
        "http://www.move-me.mobi/NextArrivals/GetScheds?providerName=STCP&stopCode=STCP_FEUP2";
      const response = await global.fetch(searchUrl); // fetch page
      const text = await response.text(); // get response text
      const json = JSON.parse(text); // get response text

      const info = json
        .map(({ Value }) => Value)
        .map(([line, destination, time]) => {
          return { line, destination, time, id: line + "_" + time };
        });

      this.setState({ list: info });
    } catch (error) {
      console.log("ERRO");
      console.log(error);
      this.setState({ list: "error" });
    }
  }

  componentDidMount() {
    this.loadMenu();
  }

  renderList() {
    if (this.state.list !== undefined) {
      return (
        <FlatList
          data={this.state.list}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
        />
      );
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
          <TabHeader>
            <TabHeaderText>{this.state.title}</TabHeaderText>
          </TabHeader>
          {this.renderList()}
        </TabItem>
      </ThemeProvider>
    );
  }
}
