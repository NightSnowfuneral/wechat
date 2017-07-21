import { GET_DISPOSE_DATA,CLEAR_DISPOSE_DATA } from '../constants/ActionTypes'

const dispose = (state={},action) => {
	switch(action.type) {
		case GET_DISPOSE_DATA :
			return action.data
		case CLEAR_DISPOSE_DATA :
			return {images:[]}
		default :
			return state
	}
}

export default dispose