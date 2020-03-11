import { call, put, takeLatest, select } from 'redux-saga/effects'
import { getStops, setStops } from '../../constants/Storage'
import { Types, creators } from '../ducks/stops'

function* saveStops() {
  const stops = yield select(state => state.stops) // grab the updated state

  yield call(setStops, stops)
}

function* loadStops() {
  const stops = yield call(getStops)
  const action = yield call(creators.loadStopsSuccess, stops)

  yield put(action)
}

function* mySaga() {
  yield takeLatest(Types.ADD, saveStops)
  yield takeLatest(Types.REMOVE, saveStops)
  yield takeLatest(Types.LOAD, loadStops)
}

export default mySaga
