import { AsyncStorage } from "react-native";
import { PROVIDERS, STOPS_KEY, PROVIDERS_DATA } from "./Strings";

export async function fetchURL(searchUrl) {
  const response = await fetch(searchUrl); // fetch page
  const text = await response.text(); // get response text

  return text;
}

export async function loadStops() {
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

    return stops;
  } catch (error) {
    console.log("ERRO");
    console.log(error);
    return [];
  }
}
