import { GET_REPORT_DATA,CLEAR_REPORT_DATA } from '../constants/ActionTypes'

const report = (state={},action) => {
	switch(action.type) {
		case GET_REPORT_DATA :
			return action.data
		case CLEAR_REPORT_DATA :
			return {}
		default :
			return state
	}
}

export default report