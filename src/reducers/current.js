import { GET_CURRENT_LIST } from '../constants/ActionTypes'
import objectAssign from 'object-assign'

const current = (state={list:[]},action) => {
	switch(action.type) {
		case GET_CURRENT_LIST :
			return objectAssign({},state,action.data)
		default :
			return state
	}
}

export default current