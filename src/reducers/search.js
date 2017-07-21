import { SET_SEARCH_LIST } from '../constants/ActionTypes'

const search = (state={},action) => {
	switch(action.type) {
		case SET_SEARCH_LIST :
			return action.data
		default :
			return state
	}
}

export default search