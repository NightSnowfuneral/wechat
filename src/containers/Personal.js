import React,{Component} from 'react'
import { withRouter } from 'react-router'
import { List } from 'antd-mobile'

const Item=List.Item
const Brief=Item.Brief

class Personal extends Component{
	render(){
		return (
			<div className='personal'>
				<List renderHeader={() => ''} className="header-list">
					<Item arrow="horizontal" thumb="/src/assets/image/personal_avator.jpg" onClick={() => {}} multipleLine>
						小米
						<Brief>手机号：13575407573</Brief>
					</Item>
				</List>
				<List renderHeader={() => ''} className="content-list">
					<Item arrow="horizontal" onClick={() => {this.props.router.push('/task')}}>
						我的任务
					</Item>
				</List>
			</div>
		)
	}
} 

export default withRouter(Personal)