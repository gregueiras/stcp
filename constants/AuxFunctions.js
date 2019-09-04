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

export function distance({ lat, lon }, { x, y }) {
  toRadians = function(number) {
    return (number * Math.PI) / 180;
  };

  const R = 6371e3; // metres
  const φ1 = toRadians(lat);
  const φ2 = toRadians(x);
  const Δφ = toRadians(x - lat);
  const Δλ = toRadians(y - lon);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
