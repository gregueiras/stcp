import { createStore, compose } from 'redux'

import reducers from './ducks'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducers, undefined, composeEnhancers())

export default store
