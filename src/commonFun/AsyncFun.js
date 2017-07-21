import { Toast } from 'antd-mobile'
import Get from '../commonFun/Get'
import Wechat from '../commonFun/Wechat'
import { changeLoading,setCommonData,setCurrent,setHistory } from '../actions'
import AlertObj from './AlertObj'

const get=new Get()
const wechat=new Wechat()

export const uploadImage=async (images)=>{
	const newImages=[]
	for(var image of images){
		const res=await wechat.wxUploadImage(image)
		newImages.push(res.serverId)
	}
	return newImages
}

export const getLocation = async (setLocation) => {

	const location=await wechat.wxGetLocation()
    setLocation(location)

}

export const getCommonData=async (dispatch) => {


	const data=await get.commonData()

	dispatch(setCommonData(data))

}

export const getCurrent=async (dispatch)=>{
	const params={status:'0'}
	dispatch(changeLoading(true))

	const data=await get.task(params)
	dispatch(setCurrent(data))
	dispatch(changeLoading(false))
}

export const getHistory=async (dispatch)=>{
	const params={status:'1'}
	dispatch(changeLoading(true))

	const data=await get.task(params)

	dispatch(changeLoading(false))
	dispatch(setHistory(data))
}

export const getTypeinDetail=async (dispatch,id)=>{
	dispatch(changeLoading(true))

	const data=await get.typeinDetail(id)

	dispatch(changeLoading(false))

	return data
}

export const resultPickerData=async (params)=>{
	const res=await get.organization(params)
	if(res.length>0){
		const p={
			type:res[0].type,
			id:res[0].id
		}
		const children=await resultPickerData(p)
		if(children.length>0){
			res[0].children=children
		}
		
	}
	return res
}
