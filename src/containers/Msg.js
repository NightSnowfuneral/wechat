import React,{Component} from 'react'
import {connect} from 'react-redux'
import { InputItem,Button,ActionSheet,Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { withRouter } from 'react-router'
import { changeLoading } from '../actions'
import Post from '../commonFun/Post'
import { trim } from '../commonFun/Reg'
import AlertObj from '../commonFun/AlertObj'

const time=60
const post=new Post()

class Msg extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			time:time
		}
	}
	componentDidMount() {
		this.tick(this.state.time)
	}
	componentWillUnmount() {
		clearInterval(this.timer)
	}

	tick(time){
		this.timer=setInterval(()=>{
			if(time>0){
				time-=1
				this.setState({time})
			}else{
				clearInterval(this.timer)
			}
		},1000)
	}
	showActionSheet(){
		const buttons=['重新获取短信验证码','取消']
		ActionSheet.showActionSheetWithOptions({
			options:buttons,
			cancelButtonIndex:buttons.length-1,
			maskClosable:true
		},
		(buttonIndex)=>{
			this.showActionSheetCallBack(buttonIndex)
		})
	}
	showActionSheetCallBack(buttonIndex){
		switch(buttonIndex) {
			case 0:
				return this.getMsg()
			case 1:
				return console.log('取消')
			default:
				return console.log(buttonIndex)
		}
	}
	async getMsg(){
		this.tick(time)
		this.props.changeLoading(true)

		const data={phone:trim(this.props.phone)}
		await post.verification(data)

		this.props.changeLoading(false)

		Toast.success('已发送',0.8)
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{
			if(!error){
				const data={yzm:value.verification}
				this.props.changeLoading(true)

				const res=await post.user(data)
				console.log(res)
				if(res.code==200){
					this.props.router.replace('/result')
				}else if(res.code==404){
					alert('验证码错误请重新输入','',[
						{text:'知道了'}
					])
				}
				this.props.changeLoading(false)		
			}
		})
	}

	render(){
		const {getFieldProps}=this.props.form
		return (
			<div className="msg">
		        <h3 className="title">短信验证码已发送，请填写验证码</h3>
		        <InputItem
		            placeholder={this.props.phone}
		            type="phone"
		            className="input"
		            disabled={true}
	            >
	            	手机号
	            </InputItem>

	            <InputItem
		            {...getFieldProps('verification',{
		            	rules:[{required:true}]
		            })}
		            type="number"
		            maxLength={6}
		            placeholder="验证码输入"
		            className="verification"
		            clear={true}
		            autoFocus={true}
		            className="input"
	            >
	            	验证码
	            </InputItem>

				<Button 
	            	className='btn' 
	            	type="primary"
	            	disabled={!getFieldProps('verification').value}	
	            	onClick={this.handleSubmit.bind(this)}
	            >
	            	提交
	            </Button>

	            {this.state.time!=0 && 
	            	<p className='surplusTime'>
	            		接收短信大约需要{this.state.time}秒
	            	</p>
	            }
	            {this.state.time==0 && 
					<p 
						className='showActionSheet' 
						onClick={this.showActionSheet.bind(this)}
					>
						收不到验证码
					</p>
	            }
		    </div>
		)
	}
}

const mapStateToProps = (state) =>({
	phone:state.phone,
})
const mapDispatchToProps={
	changeLoading,
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(createForm()(Msg)) )