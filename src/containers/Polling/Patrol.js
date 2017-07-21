import React,{Component} from 'react'
import {Link} from 'react-router'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import {List} from 'antd-mobile'
import moment from 'moment'
import Get from '../../commonFun/Get'
import {changeLoading} from '../../actions'
import {isEmptyObject,timeFormat} from '../../commonFun/Format'

const get =new Get()
const Item=List.Item
const Brief=Item.Brief
const nowDate=moment().valueOf()

class Patrol extends Component{
	constructor(props) {
		super(props)

		this.state={
			task:{},
		}
	}
	componentDidMount() {
		this.getPatrol()
	}
	componentWillUnmount() {
		this.props.router.setState({
			scrollTop:this.props.location.state.scrollTop
		})
	}
	async getPatrol(){
		const {params,dispatch}=this.props

		dispatch(changeLoading(true))
		const res=await get.patrol(params.id)
		console.log(res)
		dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({task:res.task})
		}

	}
	render(){
		const {params}=this.props
		const {task}=this.state
		
		return (
			<div className='patrol'>
				{ !isEmptyObject(task) &&
					<div className='list-box'>
						<List className='row-list'>
							<Item 
								thumb={<div className='thumb'></div>} 
								multipleLine
								extra={task.status}
							>
					            {task.stationName}
					            <Brief>
					            	巡视等级：
					            	<span style={{color:'#ff5722'}}>{task.level}</span>
					            </Brief>
				       		</Item>
						</List>
						<List renderHeader={() => '巡视时间：'} className='center-list'>
							<Item className='date-extra' extra={task.lastTime}>最近巡视时间：</Item>
							<Item className='date-extra' extra={timeFormat(nowDate,moment(task.deadTime).valueOf())}>巡视剩余时间：</Item>
						</List>
						<List renderHeader={() => '地点描述：'} className='center-list'>
							<Item extra={task.floor+'楼'}>大厦楼层：</Item>
							<Item className='date-extra' extra={task.building}>大厦名称：</Item>
						</List>
						<List renderHeader={() => '历史缺陷'} className='center-list'>
							<Item arrow='horizontal' onClick={()=>{this.props.router.push({pathname:'/station/'+task.stationID,query:{activeTab:'0'}})}}>未归档</Item>
							<Item arrow='horizontal' onClick={()=>{this.props.router.push({pathname:'/station/'+task.stationID,query:{activeTab:'1'}})}}>已归档</Item>
						</List>
						<List renderHeader={() => '巡视卡'} className='center-list'>
							<Item arrow='horizontal' onClick={()=>{this.props.router.push('/patrolcard/'+params.id)}}>巡视卡</Item>
						</List>
					</div>
				}
				
			</div>
		)
	}
}

export default withRouter(connect()(Patrol)) 