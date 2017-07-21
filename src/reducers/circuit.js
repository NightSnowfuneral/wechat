import { GET_CIRCUIT_DATA,CLEAR_CIRCUIT_DATA } from '../constants/ActionTypes'

const circuit = (state={},action) => {
	switch(action.type) {
		case GET_CIRCUIT_DATA :
			return action.data
		case CLEAR_CIRCUIT_DATA :
			return {}
		default :
			return state
	}
}

export default circuit