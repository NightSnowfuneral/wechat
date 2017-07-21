import { GET_PHONE } from '../constants/ActionTypes'

const phone = (state='',action) => {
	switch(action.type) {
		case GET_PHONE :
			return action.phone
		default :
			return state
	}
}

export default phone