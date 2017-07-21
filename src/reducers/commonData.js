import { GET_COMMON_DATA } from '../constants/ActionTypes'

const phone = (state={},action) => {
	switch(action.type) {
		case GET_COMMON_DATA :
			return action.data
		default :
			return state
	}
}

export default phone