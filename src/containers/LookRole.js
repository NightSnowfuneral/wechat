import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,InputItem,TextareaItem,Accordion,Icon,Modal } from 'antd-mobile'
import { withRouter,Link } from 'react-router'
import Get from '../commonFun/Get'
import {fetchPrivilegesIfNeeded,changeLoading} from '../actions'
import {isSwitchFormat} from '../commonFun/Format'
import AlertObj from '../commonFun/AlertObj'

const Item=List.Item
const alert=Modal.alert
const get=new Get()

class LookRole extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			privilegeDetail:{},
			roleUser:[],
			isPrivilegeList:[]
		}
	}
	async componentDidMount() {
		const {params}=this.props

		this.props.dispatch(changeLoading(true))

		this.props.dispatch(fetchPrivilegesIfNeeded())
		const res1=await get.privilegeDetail(params.id)
		const res2=await get.roleUser(params.id)
		this.props.dispatch(changeLoading(false))
		const isPrivilegeList=isSwitchFormat(this.props.privilegesList,res1.privilege.privilege)
		this.setState({
			privilegeDetail:res1.privilege,
			roleUser:res2.list,
			isPrivilegeList
		})

		
	}
	handleLinkClick(router){
		const {params}=this.props
		if(params.id==='1'){
			alert('超级管理员不得修改哦','',[
				{text:'知道了'}
			])
		}else{
			const newRouter=router+params.id
			this.props.router.push(newRouter)
		}
		
	}
	
	render(){
		const {privilegeDetail,roleUser,isPrivilegeList}=this.state
		const {params}=this.props

		return (
			<div className='lookrole'>
				<List renderHeader={() => '角色基础信息'} className='picker-list'>
					<InputItem
						editable={false}
						value={privilegeDetail.name }
					>
		            	角色名称：
		            </InputItem>
		            <TextareaItem
			            title='角色描述：'
			            autoHeight
			            count={100}
			            editable={false}
			            value={privilegeDetail.description}
			        />

				</List>

				<div className='accordion-box'>
					<div className='title'>绑定信息</div>
					<Accordion defaultActiveKey="0" className="my-accordion">
				        <Accordion.Panel header="已分配人员">
				            <List className="my-list">
				                {roleUser.map((item)=>{
				                	const thumbStyle=item.avator.length>0?{backgroundImage:'url('+item.avator+')'}:{}
				                	return <Item
										        thumb={<div style={thumbStyle} className='thumb'></div>}
										    >
										        {item.name}
										    </Item>
				                })}
				            </List>
				        </Accordion.Panel>
			        </Accordion>
			        <div className='link' onClick={this.handleLinkClick.bind(this,'/allotuser/')}>人员分配</div>
				</div>

				<div className='accordion-box'>
					<Accordion defaultActiveKey="0" className="my-accordion">
				        <Accordion.Panel header="已分配的权限">
				            <List className="my-list">
				            	{ isPrivilegeList.map((item)=>
				            		<Item thumb={<Icon type='blue_typein_icon' />}>
				            			{item.name}
				            		</Item>
				            	)}
				            </List>
				        </Accordion.Panel>
			        </Accordion>
			        <div className='link' onClick={this.handleLinkClick.bind(this,'/role/')}>角色修改</div>
				</div>

			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	privilegesList:state.privileges,
})

export default withRouter(connect(mapStateToProps)(LookRole))
/*to={'/allotuser/'+params.id}*/