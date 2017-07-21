import { GET_PRIVILEGES } from '../constants/ActionTypes'

const privileges = (state=[],action) => {
	switch(action.type) {
		case GET_PRIVILEGES :
			return action.list
		default :
			return state
	}
}

export default privileges