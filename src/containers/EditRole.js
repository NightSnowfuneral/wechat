import React,{Component} from 'react'
import { withRouter } from 'react-router'
import { List, Switch,InputItem,Button,Modal,TextareaItem,Toast } from 'antd-mobile'
import { connect } from 'react-redux'
import { createForm } from 'rc-form'
import {switchFormat,switchStateFormat} from '../commonFun/Format'
import Post from '../commonFun/Post'
import Get from '../commonFun/Get'
import {fetchPrivilegesIfNeeded,changeLoading} from '../actions'
import {isSwitchFormat,noSwitchFormat} from '../commonFun/Format'

const Item=List.Item
const alert=Modal.alert
const post=new Post()
const get=new Get()

class Edit extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			privilegeDetail:{}
		}
	}
	async componentDidMount() {
		const {params}=this.props

		this.props.dispatch(fetchPrivilegesIfNeeded())

		if(params.id!=='0'){
			this.props.dispatch(changeLoading(true))
			const res=await get.privilegeDetail(params.id)
			this.props.dispatch(changeLoading(false))
			if(res.code==200){
				this.setState({
					privilegeDetail:res.privilege
				})
			}
			
		}

		

	}

	renderSwitch(item,value){
		const { getFieldProps } = this.props.form
		
		return (
			<Switch 
				{...getFieldProps('privilege-'+item.id,{
					initialValue:value,
					valuePropName: 'checked'
				})}
			/>
		)
	}
	handleSubmit(e){
		e.preventDefault()

		const {params}=this.props
		let res={}

		this.props.form.validateFields(async (error,value)=>{
			if(!error){
				const data={}
				data.name=value.name
				data.description=value.description
				data.privilege=switchFormat(value)

				if(params.id==='0'){
					 res=await post.role(this.props.dispatch,data)
				}else{
					 res=await post.putRole(this.props.dispatch,data,params.id)
				}

				if(res.code===200){
					Toast.success(res.msg,0.8,()=>{
						this.props.router.goBack()
					})
				}
				
			}else{
				alert('请先完成角色基础信息','',[
					{text:'知道了'}
				])
			}
		})
	}
	render(){
		const { getFieldProps } = this.props.form
		const {privilegesList,params}=this.props
		const {privilegeDetail}=this.state
		const isPrivilegeList=isSwitchFormat(privilegesList,privilegeDetail.privilege)
		const noPrivilegeList=noSwitchFormat(privilegesList,privilegeDetail.privilege)

		return (
			<div className='addrole'>
				<List renderHeader={() => '角色基础信息'} className='picker-list'>
					<InputItem
			            {...getFieldProps('name',{
			            	initialValue:privilegeDetail.name || '',
			            	rules:[{required:true}]
			            })}
			            maxLength={10}
			            clear={true}
		            >
		            	角色名称：
		            </InputItem>
		            <TextareaItem
			            {...getFieldProps('description',{
			            	initialValue:privilegeDetail.description || '',
			            	rules:[{required:true}]
			            })}
			            title='角色描述：'
			            autoHeight
			            count={100}
			        />

				</List>
				
				<div style={{height:document.documentElement.clientHeight-195,overflowY:'auto'}}>
					{params.id==='0' && 
						<List renderHeader={() => '权限分配'} className='header-list' >
							{privilegesList.map((item)=>
								<Item 
						        	extra={this.renderSwitch(item,false)}
						        >
						        	{item.name}
						        </Item>
							)}
					        
					    </List>
					}
					{params.id!=='0' && 
						<List renderHeader={() => '已分配权限'}>
							{isPrivilegeList.map((item)=>
								<Item 
						        	extra={this.renderSwitch(item,true)}
						        >
						        	{item.name}
						        </Item>
							)}
					        
					    </List>
					}
					{params.id!=='0' && 
						<List renderHeader={() => '未分配权限'}>
							{noPrivilegeList.map((item)=>
								<Item 
						        	extra={this.renderSwitch(item,false)}
						        >
						        	{item.name}
						        </Item>
							)}
					        
					    </List>
					}
				</div>
				

			    <Button type='primary' className="btn" onClick={this.handleSubmit.bind(this)}>
			    	{params.id==='0'?'角色创建':'确认修改'}
			    </Button>
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	privilegesList:state.privileges,
})


export default withRouter(connect(mapStateToProps)(createForm()(Edit))) 