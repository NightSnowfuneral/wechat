import objectAssign from 'object-assign'
import {REQUEST_GET_STATION,RECEIVE_GET_STATION} from '../constants/ActionTypes'

const initialState={
	isFetching:false,
	names:[]
}
const station=(state=initialState,action)=>{
	switch(action.type) {
		case REQUEST_GET_STATION:
			return objectAssign({},state,{isFetching:true,names:[]})
		case RECEIVE_GET_STATION:
			return objectAssign({},state,{isFetching:false,names:action.names})
		default:
			return state
	}
}

export default station
