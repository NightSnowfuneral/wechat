import React,{Component} from 'react'
import { Button,InputItem,Flex,Modal,Toast } from 'antd-mobile'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import { createForm } from 'rc-form'
import { changeLoading,setPhone } from '../actions'
import { authPhone,trim } from '../commonFun/Reg'
import Post from '../commonFun/Post'

const alert=Modal.alert
const post=new Post()

class Bind extends Component{
    handleSubmit(e){
		e.preventDefault()
		if(!this.props.loading){
			this.props.changeLoading(true)

			setTimeout(()=>{
				this.props.form.validateFields(async (error,value)=>{
					if(!error){
						const phone=trim(value.phone)
						if(authPhone(phone)){
							const postData={phone:phone}
							const res=await post.verification(postData)

							if(res.code==404){
								alert('手机号码不存在，请联系管理员','',[
									{text:'知道了'}
								])
							}else if(res.code==200){
								this.props.setPhone(value.phone)
								Toast.success('已发送',0.5)
								this.props.router.replace('/msg')
							}
							this.props.changeLoading(false)
							
						}
						else{
							alert('手机号码格式不正确，请从新输入','',[
								{text:'知道了'}
							])
							this.props.changeLoading(false)
						}
					}
				})
			},800)
		}
	}
	render(){
		const {getFieldProps}=this.props.form
		return (
			<div className='bind'>
				<h3 className="title">绑定手机号</h3>
				<InputItem
		            {...getFieldProps('phone',{
		            	rules:[{required:true}]
		            })}
		            type="phone"
		            clear={true}
		            placeholder="手机号码输入"
		            autoFocus={true}
		            className="input"
	            >
	            	手机号
	            </InputItem>
	            <Button 
	            	className='btn' 
	            	type="primary"
	            	disabled={!getFieldProps('phone').value}	
	            	onClick={this.handleSubmit.bind(this)}
	            >
	            	立即绑定
	            </Button>

			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	loading:state.loading,
})

const mapDispatchToProps={
	changeLoading,
	setPhone
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(createForm()(Bind)))  
