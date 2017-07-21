import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List  } from 'antd-mobile'
import { withRouter,Link } from 'react-router'
import moment from 'moment'
import Get from '../../commonFun/Get'
import {changeLoading} from '../../actions'
import ListViewBar from '../../components/ListViewBar'

const Item=List.Item
const Brief=Item.Brief
const get=new Get()
const nowDate="2017.05.16"/*moment().format('YYYY.MM.DD')*/
const nowBeforeDate="2017.05.19"/*moment().subtract(-10, 'days').format('YYYY.MM.DD')*/

class PatrolTask extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			lists:[],
			allCount:'0',
			unfinishedCount:'0',
			scrollTop:props.location.state?props.location.state.scrollTop:0
		}
	}
	async componentDidMount() {

		this.props.dispatch(changeLoading(true))
		const res=await get.tasks()
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({lists:res.tasks,allCount:res.count,unfinishedCount:res.tasks.length})
		}
	}
	componentWillUnmount() {
		const {scrollTop}=this.state
		this.props.router.setState({
			scrollTop
		})
	}
	listRenderRow(row){
		const thumbStyle=row.avator?{backgroundImage:'url('+row.avator+')'}:{}
		return <List
					key={row.id}
					className='row-list'
				>
					<Item
						onClick={() => this.props.router.push('/patrol/'+row.id) }
						arrow='horizontal'
						thumb={<div style={thumbStyle} className='thumb'></div>}
					>
						{row.name}
						<Brief>巡视等级：<span style={{color:'#ff5722'}}>{row.level}</span></Brief>
					</Item>
				</List>
	}
	handleSetScrollTop(scrollTop){
		this.setState({
			scrollTop:scrollTop
		})
	}
	render(){
		const {allCount,unfinishedCount}=this.state
		return (
			<div className='patrolTask'>
				<div className='date-box text'>
					{nowDate} - {nowBeforeDate} 
				</div>
				<div className='list-box'>
					<div className='header'>
						<div className='text'>巡检任务（{unfinishedCount}/{allCount}）</div>
						<Link className='text link' to='/patroltoday'>今日任务</Link>
					</div>
					{ this.state.lists.length>0 &&
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.lists} 
							noListHeight={72}
							handleScroll={this.handleSetScrollTop.bind(this)}
							scrollTop={this.state.scrollTop} 
						/>
					}
				</div>
			</div>
		)
	}
}


export default withRouter(connect()(PatrolTask)) 
