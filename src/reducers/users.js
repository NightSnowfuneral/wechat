import { GET_USERS } from '../constants/ActionTypes'

const Users = (state=[],action) => {
	switch(action.type) {
		case GET_USERS :
			return action.list
		default :
			return state
	}
}

export default Users