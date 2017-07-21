import { GET_HISTORY_LIST } from '../constants/ActionTypes'
import objectAssign from 'object-assign'

const history = (state={list:[]},action) => {
	switch(action.type) {
		case GET_HISTORY_LIST :
			return objectAssign({},state,action.data)
		default :
			return state
	}
}

export default history