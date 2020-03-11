export const Types = {
  ADD: 'stops/ADD',
  REMOVE: 'stops/REMOVE',
  LOAD: 'stops/LOAD',
  LOAD_SUCCESS: 'stops/LOAD_SUCCESS',
}

const INITIAL_STATE = []

export default function stops(state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {
    case Types.ADD:
      return [...state, payload.stop]

    case Types.REMOVE:
      return state.filter(({ provider, stop }) => !(provider === payload.stop.provider && stop === payload.stop.stop))

    case Types.LOAD_SUCCESS:
      return action.payload.stops

    default:
      return state
  }
}

export const creators = {
  addStop: stop => ({
    type: Types.ADD,
    payload: {
      stop,
    },
  }),
  removeStop: stop => ({
    type: Types.REMOVE,
    payload: {
      stop,
    },
  }),
  loadStops: () => ({
    type: Types.LOAD,
    payload: {},
  }),
  loadStopsSuccess: loadedStops => ({
    type: Types.LOAD_SUCCESS,
    payload: { stops: loadedStops },
  }),
}
