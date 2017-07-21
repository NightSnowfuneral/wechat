import 'whatwg-fetch'
import queryString from 'query-string'
import objectAssign from 'object-assign'
import {Modal} from 'antd-mobile'
import config from '../constants/Config'

const alert=Modal.alert

const Ajax=function(opts){
	this.getUrlParams=opts.params
	this.getUrl=config.apiUrl.path+opts.url+"?"+queryString.stringify(this.getUrlParams)
	this.postUrl=config.apiUrl.path+opts.url
	this.putUrl=config.apiUrl.path+opts.url
	this.data=objectAssign({},opts.data)
}

Ajax.prototype.get=function(){
	const p=new Promise((resolve,reject)=>{
		fetch(this.getUrl,{
			credentials: 'include'
		})
			.then((response)=>{
				if(response.status===200){
					return response.json()
				}else if(response.status===401){
					alert('你的权限不够','',[
						{text:'知道了',onPress:()=>{history.back()}}
					])
					return '权限不够'
				}
			})
			.then((res)=>resolve(res))
			.catch((error)=>console.log(error))
	})
	return p
}
Ajax.prototype.delete=function(){
	const p=new Promise((resolve,reject)=>{
		fetch(this.getUrl,{
			credentials: 'include',
			method:'DELETE',
		})
			.then((response)=>response.json())
			.then((res)=>resolve(res))
			.catch((error)=>console.log(error))
	})
	return p
}
Ajax.prototype.post=function(){
	const p=new Promise((resolve,reject)=>{
		fetch(this.postUrl,{
			credentials: 'include',
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			mode:'cors',
			body:JSON.stringify(this.data)
		})
		.then(response=>{
			if(response.status===200){
				return response.json()
			}else if(response.status===401){
				alert('你的权限不够','',[
					{text:'知道了',onPress:()=>{history.back()}}
				])
				return '权限不够'
			}
		})
		.then(res=>resolve(res))
		.catch(error=>console.log(error))
	})
	return p
}
Ajax.prototype.put=function(){
	const p=new Promise((resolve,reject)=>{
		fetch(this.putUrl,{
			credentials: 'include',
			method:'PUT',
			headers:{
				'Content-Type':'application/json'
			},
			mode:'cors',
			body:JSON.stringify(this.data)
		})
		.then(response=>{
			if(response.status===200){
				return response.json()
			}else if(response.status===401){
				alert('你的权限不够','',[
					{text:'知道了',onPress:()=>{history.back()}}
				])
				return '权限不够'
			}
		})
		.then(res=>resolve(res))
		.catch(error=>console.log(error))
	})
	return p
}

export default Ajax