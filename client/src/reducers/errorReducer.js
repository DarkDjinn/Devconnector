import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';
export default function(state = {}, action) {
	switch (action.type) {
		case CLEAR_ERRORS:
			return {};
		case GET_ERRORS:
			return action.payload;
		default:
			return state;
	}
}
