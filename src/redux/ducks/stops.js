// Actions

export const Types = {
  ADD: 'stops/ADD',
  REMOVE: 'stops/REMOVE',
  LOAD: 'stops/LOAD',
}

const INITIAL_STATE = []

export default function stops(state = INITIAL_STATE, action) {
  const { payload } = action

  switch (action.type) {
    case Types.ADD:
      return [...state, payload.stop]

    case Types.REMOVE:
      return state.filter(stop => JSON.stringify(stop) !== JSON.stringify(payload.stop))

    case Types.LOAD:
      return payload.stops

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
  loadStops: loadedStops => ({
    type: Types.LOAD,
    payload: {
      loadedStops,
    },
  }),
}
