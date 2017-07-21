import * as ActionTypes from '../constants/ActionTypes'
import Get from '../commonFun/Get'

const get=new Get()

export const changeLoading = (loading) => ({
	type:ActionTypes.CHANGE_LOADING,
	loading
})

export const setPhone =(phone)=>({
	type:ActionTypes.GET_PHONE,
	phone
})

export const setCommonData=(data)=>({
	type:ActionTypes.GET_COMMON_DATA,
	data
})

export const setCurrent=(data)=>({
	type:ActionTypes.GET_CURRENT_LIST,
	data
})

export const setHistory=(data)=>({
	type:ActionTypes.GET_HISTORY_LIST,
	data
})

export const setTypein=(data)=>({
	type:ActionTypes.GET_TYPEIN_DATA,
	data
})
export const clearTypein=()=>({
	type:ActionTypes.CLEAR_TYPEIN_DATA
})

export const setDispose=(data)=>({
	type:ActionTypes.GET_DISPOSE_DATA,
	data
})
export const clearDispose=()=>({
	type:ActionTypes.CLEAR_DISPOSE_DATA
})

export const setCircuit=(data)=>({
	type:ActionTypes.GET_CIRCUIT_DATA,
	data
})
export const clearCircuit=()=>({
	type:ActionTypes.CLEAR_CIRCUIT_DATA
})

export const setReport=(data)=>({
	type:ActionTypes.GET_REPORT_DATA,
	data
})
export const clearReport=()=>({
	type:ActionTypes.CLEAR_REPORT_DATA
})

export const setSearch=(data)=>({
	type:ActionTypes.SET_SEARCH_LIST,
	data
})

export const requestGetStationNames=()=>({
	type:ActionTypes.REQUEST_GET_STATION
})
export const receiveGetStationNames=(json)=>({
	type:ActionTypes.RECEIVE_GET_STATION,
	names:json.list
})
export const getStationNames=(value)=>async (dispatch)=>{
	dispatch(requestGetStationNames())
	const json=await get.station(value)
	dispatch(receiveGetStationNames(json))
}

export const getPrivileges=(json)=>({
	type:ActionTypes.GET_PRIVILEGES,
	list:json.list
})
const fetchPrivileges=()=>async (dispatch)=>{
	const json=await get.privileges()
	dispatch(getPrivileges(json))
}
const shouldFetchPrivileges=(state)=>{
	if(state.privileges.length>0){
		return false
	}else{
		return true
	}
}
export const fetchPrivilegesIfNeeded=()=>(dispatch,getState)=>{
	if(shouldFetchPrivileges(getState())){
		return dispatch(fetchPrivileges())
	}
}

export const getUsers=(json)=>({
	type:ActionTypes.GET_USERS,
	list:json.list
})
const fetchUsers=()=>async (dispatch)=>{
	const json=await get.users('')
	dispatch(getUsers(json))
}
const shouldFetchUsers=(state)=>{
	if(state.users.length>0){
		return false
	}else{
		return true
	}
}
export const fetchUsersIfNeeded=()=>(dispatch,getState)=>{
	if(shouldFetchUsers(getState())){
		return dispatch(fetchUsers())
	}
}

export const getMenu=(name,json)=>({
	type:ActionTypes.GET_MENU,
	name,
	list:json.menus
})
const fetchMenu=(name)=>async (dispatch)=>{
	
	const json=await get.menu(name)
	dispatch(getMenu(name,json))
}
const shouldFetchMenu=(state,name)=>{
	if(!state.menu[name]){
		return true
	}else{
		return false
	}
}
export const fetchMenuIfNeeded=(name)=>(dispatch,getState)=>{
	if(shouldFetchMenu(getState(),name)){
		return dispatch(fetchMenu(name))
	}
}