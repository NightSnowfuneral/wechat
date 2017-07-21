import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,InputItem,TextareaItem,Switch,Button,Toast  } from 'antd-mobile'
import { withRouter,Link } from 'react-router'
import { createForm } from 'rc-form'
import Get from '../commonFun/Get'
import Post from '../commonFun/Post'
import {fetchPrivilegesIfNeeded,changeLoading} from '../actions'
import {isSwitchFormat,noSwitchFormat,switchFormat} from '../commonFun/Format'


const Item=List.Item
const Brief=Item.Brief
const get=new Get()
const post=new Post()

class LookUser extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			user:{},
			roles:[]
		}
	}
	async componentDidMount() {
		const {params}=this.props

		this.props.dispatch(changeLoading(true))

		const res1=await get.userDetail(params.id)
		const res2=await get.roles()
		this.props.dispatch(changeLoading(false))

		this.setState({user:res1.user,roles:res2.list})


		
	}

	renderSwitch(item,value){
		const { getFieldProps } = this.props.form
		
		return (
			<Switch 
				{...getFieldProps('user-'+item.id,{
					initialValue:value,
					valuePropName: 'checked'
				})}
			/>
		)
	}
	handleClick(id,e){
		if(e.target.innerHTML!=''){
			this.props.router.push('/role/'+id)
		}
	}
	handleSubmit(e){
		e.preventDefault()
		const {params}=this.props

		this.props.form.validateFields(async (error,value)=>{
			const data={}
			data.roles=switchFormat(value)
			const res=await post.putUser(this.props.dispatch,data,params.id)

			if(res.code===200){
				Toast.success(res.msg,0.8,()=>{
					this.props.router.goBack()
				})
			}
		})
	}
	
	render(){
		const {user,roles}=this.state
		const isUserList=isSwitchFormat(roles,user.roles)
		const noUserList=noSwitchFormat(roles,user.roles)

		return (
			<div className='lookuser'>
				<List className="row-list">
			        <Item
						onClick={()=>{}}
						thumb={user.avator}
					>
						{user.name}
						<Brief>部门：{user.department}</Brief>
						<Brief>手机号：{user.phone}</Brief>
					</Item>
			    </List>
			    <div style={{height:document.documentElement.clientHeight-180,overflowY:'auto'}}>
			    	<List renderHeader={() => '已分配角色'}>
						{isUserList.map((item)=>
							<Item 
					        	extra={this.renderSwitch(item,true)}
					        	arrow={'horizontal'}
					        	onClick={this.handleClick.bind(this,item.id)}
					        >
					        	{item.name}
					        </Item>
						)}
				        
				    </List>
				    <List renderHeader={() => '未分配角色'}>
						{noUserList.map((item)=>
							<Item 
					        	extra={this.renderSwitch(item,false)}
					        	arrow={'horizontal'}
					        	onClick={this.handleClick.bind(this,item.id)}
					        >
					        	{item.name}
					        </Item>
						)}
				        
				    </List>
			    </div>
			    <Button type='primary' className="btn" onClick={this.handleSubmit.bind(this)}>
			    	确定分配
			    </Button>
			</div>
		)
	}
}

export default withRouter(connect()(createForm()(LookUser)))
