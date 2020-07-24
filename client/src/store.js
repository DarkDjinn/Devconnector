import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';

const initialState = [];

const middleware = [reduxThunk];

const store = createStore(
	reducers,
	initialState,
	applyMiddleware(...middleware)
);

export default store;
