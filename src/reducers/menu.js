import objectAssign from 'object-assign'
import {GET_MENU} from '../constants/ActionTypes'


const posts=(state=[],action)=>{
	switch(action.type) {
		case GET_MENU:
			return action.list
		default:
			return state
		
	}
}

const menu=(state={},action)=>{
	switch(action.type) {
		case GET_MENU:
			return {
				...state,
				[action.name]:posts(state[action.name],action)
			}
		default:
			return state
		
	}
}

export default menu

