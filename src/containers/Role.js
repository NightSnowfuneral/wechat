import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,Icon,Modal,Button } from 'antd-mobile'
import { withRouter } from 'react-router'
import Get from '../commonFun/Get'
import Delete from '../commonFun/Delete'
import {changeLoading} from '../actions'

const Item=List.Item
const alert=Modal.alert
const dlt=new Delete()
const get=new Get()

class Role extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			roleLists:[]
		}
	}
	componentDidMount() {
		this.setRoleLists()		
	}

	async setRoleLists(){
		this.props.dispatch(changeLoading(true))
		const res=await get.roles()
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({
				roleLists:res.list
			})
		}
		
	}
	handleRemoveClick(id,e){
		e.stopPropagation()

		alert('确定将这个角色删除？','',[
			{text:'取消',onPress:()=>{console.log('cancel')}},
			{text:'确定',onPress:this.handleOkClick.bind(this,id)}
		])
	}
	async handleOkClick(id){
		const res=await dlt.role(id)
		if(res.code===200){
			this.setRoleLists()
		}
	}
	render(){
		return (
			<div className='role'>
				<List style={{height:document.documentElement.clientHeight-62}} renderHeader={() => '角色管理'} className='header-list'>
			        {this.state.roleLists.map((item,i)=>
			       		<Item 
			       			key={i}
				        	thumb={<Icon type='blue_user_icon' size='md' />} 
				        	extra={<Icon onClick={this.handleRemoveClick.bind(this,item.id)} type='red_remove_icon.svg' size='md' />}
				        	onClick={()=>this.props.router.push('/lookrole/'+item.id)}
				        >
				        	{item.name}
				        </Item>
			        )}
			    </List>
			    <Button type='primary' className="btn-submit" onClick={()=>this.props.router.push('/role/0')}>新增角色</Button>
			</div>
		)
	}
}

export default withRouter(connect()(Role))