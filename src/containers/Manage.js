import React,{Component} from 'react'
import { List,Icon } from 'antd-mobile'
import { withRouter } from 'react-router'

const Item=List.Item

class Manage extends Component{
	render(){
		return (
			<div className='manage'>
				<List renderHeader={() => '角色管理'} className="list">
			       <Item thumb={<Icon type={require('../assets/svg/blue_user_icon.svg')} size='md' />} arrow="horizontal" onClick={() => {this.props.router.push('/role')}}>角色管理</Item>
			       <Item thumb={<Icon type={require('../assets/svg/blue_moreuser_icon.svg')} size='md' />} arrow="horizontal" onClick={() => {this.props.router.push('/user')}}>人员分配</Item>
			    </List>
			</div>
		)
	}
}

export default withRouter(Manage) 