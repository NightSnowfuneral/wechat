import React,{Component} from 'react'
import { Button,InputItem,Flex,Modal,Toast } from 'antd-mobile'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {getCommonData} from '../commonFun/AsyncFun'
import Wechat from '../commonFun/Wechat'
import Get from '../commonFun/Get'
import { changeLoading,fetchMenuIfNeeded } from '../actions'

const wechat=new Wechat()
const alert=Modal.alert
const get=new Get()

class Dashboard extends Component{
	async componentDidMount() {

		/*this.props.dispatch(changeLoading(true))*/
		const auth=await get.exist()
		if(auth){
			await this.props.dispatch(fetchMenuIfNeeded('home'))
			await getCommonData(this.props.dispatch)
			await wechat.wxConfig()
		}else{
			alert('账号还未绑定，请先绑定','',[
				{text:'知道了',onPress:()=>{this.props.router.replace('/bind')}}
			])
		}

		this.props.dispatch(changeLoading(false))

		
	}
	render(){
		return (
			<div className='dashboard'>
				{this.props.children}
			</div>
		)
	}
}


export default withRouter(connect()(Dashboard) )