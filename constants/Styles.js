import { StyleSheet, Platform, StatusBar, Animated } from "react-native";
import styled from "styled-components/native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AAA"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
    marginVertical: 20
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  center: {
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        marginTop: 15
      },
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  },

  tabItem: {
    width: "100px",
    height: "100px",
    backgroundColor: "rgba(255,255,0,0.2)",
    borderRadius: 3,
    marginLeft: "10px",
    padding: "10px",
    justifyContent: "space-between"
  }
});

export const Container = styled(Animated.View)`
  margin: auto;
`;

export const TabsContainer = styled.ScrollView.attrs({
  horizontal: true,
  contentContainerStyle: { paddingLeft: 10, paddingRight: 20 },
  showsHorizontalScrollIndicator: false
})``;

export const TabItem = styled.View`
  width: 300px;
  height: 300px;
  background: ${props => props.theme.cardColor};
  border-radius: 10px;
  border: 0px;
  margin-left: 10px;
  padding: 10px;
  justify-content: space-between;
  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.8;
  shadow-radius: 2;
  elevation: 5;
`;

export const LineInfo = styled.View`
  margin-top: 5px;
  flex-direction: row;
  width: 100%;
`;

export const Line = styled.Text`
  color: ${props => props.theme.cardText};
  font-size: ${props => props.theme.fontSize};
  width: 50px;
  flex-grow: 1;
`;

export const Destination = styled.Text`
  color: ${props => props.theme.cardText};
  font-size: ${props => props.theme.fontSize};
  flex-grow: 2;
  width: 200px;
  text-align: left;
`;

export const Time = styled.Text`
  color: ${props => props.theme.cardText};
  font-size: ${props => props.theme.fontSize};
  flex-grow: 1;
  width: 15px;
`;

export const TabHeader = styled.View`
  background: ${props => props.theme.headerColor};
  margin-top: 0px;
  height: 50px;
  width: 300px;
  margin-left: -10px;
  margin-right: -10px;
  margin-top: -10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const TabHeaderText = styled.Text`
  text-align: center;
  font-size: 25px;
  color: ${props => props.theme.headerText}
`;

export const DefaultTheme = {
  mode: "dark",
  headerText: "#fff",
  cardText: "#333",
  fontSize: "16px",
  headerColor: "rgb(0, 115, 202)",
  cardColor: "#ddd"
};
