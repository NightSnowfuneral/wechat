import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,Icon,InputItem,SearchBar } from 'antd-mobile'
import { withRouter } from 'react-router'
import ListViewBar from '../components/ListViewBar'
import {getRoles} from '../commonFun/AsyncFun'
import Get from '../commonFun/Get'
import { changeLoading,fetchUsersIfNeeded } from '../actions'

const Item=List.Item
const Brief=Item.Brief
const get=new Get()

class User extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			showSearch:false,
			users:[],
			isFetching:false,
			searchValue:''
		}
	}
	componentDidMount() {
		this.props.dispatch(fetchUsersIfNeeded())
	}

	handleFocus(){
		this.setState({showSearch:true})
	}
	handleCancel(){
		this.setState({showSearch:false,searchValue:'',users:[]})
	}
	async handleChange(val){
		this.setState({users:[],isFetching:true,searchValue:val})
		const res=await get.users(val)
		this.setState({users:res.list,isFetching:false})
	}
	listRenderRow(row){
		const thumbStyle=row.avator.length>0?{backgroundImage:'url('+row.avator+')'}:{}
		return <List
					key={row.id}
					className='item-list'
				>
					<Item
						onClick={()=>{this.props.router.push('/user/'+row.id)}}
						thumb={<div style={thumbStyle} className='thumb'></div>}
						arrow={'horizontal'}
					>
						{row.name}
						<Brief>部门：{row.department}</Brief>
					</Item>
				</List>
	}
	render(){
		return (
			<div className='user'>
				<SearchBar 
					placeholder='查找人员/部门/手机号' 
					onFocus={this.handleFocus.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					onChange={this.handleChange.bind(this)}
					value={this.state.searchValue}
				/>
				{!this.state.showSearch?
					<div className='user-list'>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.props.users} 
							noListHeight={44} 
						/>	
					</div>:
					<div className='user-search'>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.users} 
							noListHeight={44} 
							isLoading={this.state.isFetching}
						/>	
					</div>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	users:state.users,
})

export default withRouter(connect(mapStateToProps)(User))
