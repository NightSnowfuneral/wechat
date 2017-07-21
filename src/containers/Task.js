import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import { Tabs,List } from 'antd-mobile'
import ListViewBar from '../components/ListViewBar'
import config from '../constants/Config'
import { getCurrent,getHistory } from '../commonFun/AsyncFun'
import AlertObj from '../commonFun/AlertObj'

const TabPane = Tabs.TabPane
const Item = List.Item
const Brief=Item.Brief

class Task extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			scrollTop1:props.location.state?props.location.state.scrollTop1:0,
			scrollTop2:props.location.state?props.location.state.scrollTop2:0
		}
	}
	componentDidMount() {

		const {location}=this.props
		const query=location.query
		if(query.activeTab==1){
			getHistory(this.props.dispatch)
		}else{
			getCurrent(this.props.dispatch)
		}

	}
	componentWillUnmount() {
		const {scrollTop1,scrollTop2}=this.state
		this.props.router.setState({
			scrollTop1,
			scrollTop2
		})
	}
	componentWillReceiveProps(nextProps) {
		
		if(this.props.location!=nextProps.location){
			const {query}=nextProps.location
			if(query.activeTab=='0'){
				getCurrent(nextProps.dispatch)
			}else if(query.activeTab=='1'){
				getHistory(nextProps.dispatch)
			}
		}
	}
	handleSetScrollTop(name,scrollTop){
		this.setState({
			[name]:scrollTop
		})
	}
	handleTabsChange(key){
		this.props.router.replace({pathname:'/task',query:{activeTab:key}})
	}
	listRenderRow(routerPathName,row){
		const thumbStyle=row.image.length>0?{backgroundImage:'url('+row.image+')'}:{}
		return <List
					key={row.id}
					className='row-list'
				>
					<Item
						extra={row.status}
						onClick={() => {this.props.router.push({pathname:routerPathName+row.id,state:{statusId:row.statusId}})}}
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
			<div className='task'>
				<Tabs 
					className='task-tabs' 
					animated={false}
					onChange={this.handleTabsChange.bind(this)}
					activeKey={query.activeTab || '0'}
				>
					<TabPane tab='当前缺陷' key='0'>
						<ListViewBar scrollTop={this.state.scrollTop1} handleScroll={this.handleSetScrollTop.bind(this,'scrollTop1')} renderRow={this.listRenderRow.bind(this,'/dispose/')} data={this.props.current.list} noListHeight={43.5} />
					</TabPane>
					<TabPane tab='历史缺陷' key='1'>
						<ListViewBar scrollTop={this.state.scrollTop2} handleScroll={this.handleSetScrollTop.bind(this,'scrollTop2')} renderRow={this.listRenderRow.bind(this,'/detail/')} data={this.props.history.list} noListHeight={43.5} />
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	current:state.current,
	history:state.history
})

export default withRouter(connect(mapStateToProps)(Task)) 