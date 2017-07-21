import { GET_TYPEIN_DATA,CLEAR_TYPEIN_DATA } from '../constants/ActionTypes'

const typein = (state={images:[]},action) => {
	switch(action.type) {
		case GET_TYPEIN_DATA :
			return action.data
		case CLEAR_TYPEIN_DATA :
			return {images:[]}
		default :
			return state
	}
}

export default typein