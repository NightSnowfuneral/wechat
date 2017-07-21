import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,InputItem,TextareaItem,Accordion,Switch,Button,Toast  } from 'antd-mobile'
import { createForm } from 'rc-form'
import { withRouter,Link } from 'react-router'
import Get from '../commonFun/Get'
import Post from '../commonFun/Post'
import {changeLoading} from '../actions'
import {switchFormat} from '../commonFun/Format'


const Item=List.Item
const Brief=Item.Brief
const get=new Get()
const post=new Post()

class AllotUser extends Component{
	constructor(props) {
		super(props)

		this.state={
			roleUser:[],
			noRoleUser:[]
		}
	}
	async componentDidMount() {
		const {params}=this.props

		this.props.dispatch(changeLoading(true))
		const res=await get.roleUser(params.id)
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({
				roleUser:res.list,
				noRoleUser:res.exclude
			})
		}
		

		
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
	handleSubmit(e){
		e.preventDefault()
		const {params}=this.props

		this.props.form.validateFields(async (error,value)=>{
			const data={}
			data.users=switchFormat(value)
			console.log(data)

			const res=await post.putRoleUser(this.props.dispatch,data,params.id)

			if(res.code===200){
				Toast.success(res.msg,0.8,()=>{
					this.props.router.goBack()
				})
			}
		})
	}

	render(){
		const {roleUser,noRoleUser}=this.state

		return (
			<div className='allotuser'>
				<List renderHeader={() => '已分配人员'} className='item-list' >
					{ roleUser.map((item)=>
		                	{
		                		const thumbStyle=item.avator.length>0?{backgroundImage:'url('+item.avator+')'}:{}
		                		return <Item
									        thumb={<div style={thumbStyle} className='thumb'></div>}
									        extra={this.renderSwitch(item,true)}
									    >
									        {item.name}
									        <Brief>{item.department}</Brief>
									    </Item>
		                	}
		                )}
			    </List>
			    <List renderHeader={() => '未分配人员'} className='item-list'>
				     { noRoleUser.map((item)=>
		                	{
		                		const thumbStyle=item.avator.length>0?{backgroundImage:'url('+item.avator+')'}:{}
		                		return <Item
									        thumb={<div style={thumbStyle} className='thumb'></div>}
									        extra={this.renderSwitch(item,false)}
									    >
									        {item.name}
									        <Brief>{item.department}</Brief>
									    </Item>
		                	}
		                )}   
			    </List>

			     <Button type='primary' className="btn" onClick={this.handleSubmit.bind(this)}>
			    	确定分配
			    </Button>
			</div>
		)
	}
}


export default withRouter(connect()(createForm()(AllotUser)))