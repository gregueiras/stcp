import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Options from "../components/Options";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});

export default function LinksScreen() {
  return <Options />;
}

LinksScreen.navigationOptions = {
  title: "Edit"
};
