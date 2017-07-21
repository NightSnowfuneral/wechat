import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import { Tabs,List } from 'antd-mobile'
import ListViewBar from '../../components/ListViewBar'
import config from '../../constants/Config'
import Post from '../../commonFun/Post'

const TabPane = Tabs.TabPane
const Item = List.Item
const Brief=Item.Brief
const post=new Post()

class StationHistory extends Component{
	constructor(props) {
		super(props)
		this.state={
			completedLists:[],
			unfinishedLists:[]
		}
	}

	componentDidMount() {
		const {query}=this.props.location
		this.getLists(query.activeTab)
	}

	async getLists(num){
		const {location,params}=this.props
		const data={stationID:parseInt(params.id),status:parseInt(num)}
		const res=await post.patrolHistory(this.props.dispatch,data)
		if(res.code==200){
			if(num==0){
				this.setState({completedLists:res.list})
			}else{
				this.setState({unfinishedLists:res.list})
			}
		}
	}
	handleTabsChange(key){
		const {params}=this.props
		this.props.router.replace({pathname:'/station/'+params.id,query:{activeTab:key}})
		this.getLists(key)
	}
	listRenderRow(row){
		const thumbStyle=row.image.length>0?{backgroundImage:'url('+row.image+')'}:{}
		return <List
					key={row.id}
					className='row-list'
				>
					<Item
						extra={row.status}
						onClick={() => {this.props.router.push({pathname:'/detail/'+row.id})}}
						thumb={<div style={thumbStyle} className='thumb'></div>}
					>
						{row.userName}
						<Brief>厂站：{row.stationName}</Brief>
						<Brief>时间：{row.createTime}</Brief>
					</Item>
				</List>
	}
	render(){
		const {location}=this.props
		const query=location.query
		return (
			<div className='station'>
				<Tabs 
					animated={false}
					onChange={this.handleTabsChange.bind(this)}
					activeKey={query.activeTab}
				>
					<TabPane tab='未归档' key='0'>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.completedLists} 
							noListHeight={43.5} 
						/>
					</TabPane>
					<TabPane tab='已归档' key='1'>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.unfinishedLists} 
							noListHeight={43.5} 
						/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

export default withRouter(connect()(StationHistory)) 