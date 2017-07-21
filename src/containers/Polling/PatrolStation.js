import React,{Component} from 'react'
import {withRouter,Link} from 'react-router'
import {connect} from 'react-redux'
import {List,Badge,Icon,Button,Modal} from 'antd-mobile'
import { createForm } from 'rc-form'
import Get from '../../commonFun/Get'
import Wechat from '../../commonFun/Wechat'
import {changeLoading} from '../../actions'
import {getPatrolStationList,getStationPosition,reverseBtnFormat,isSelected} from '../../commonFun/Format'

const Item=List.Item
const Brief=Item.Brief
const get=new Get()
const wechat=new Wechat()
const alert=Modal.alert
var stationList=[]
var stationPosition=[]
var end_XY=[]
var start_XY=[]
var start_dist=0

class PatrolStation extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			lists:[]
		}
	}
	async componentDidMount() {
		this.props.dispatch(changeLoading(true))
		const res=await get.taskstoday()
		const lct=await wechat.wxGetLocation()
		
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({lists:isSelected(res.tasks)})
		}

		/*start_XY=[120.6567,28.00616]*/
		start_XY=[lct.longitude,lct.latitude]
		start_dist=start_XY[0]+start_XY[1]

		stationList=getPatrolStationList(start_dist,this.state.lists)
		stationPosition=getStationPosition(stationList)
		end_XY=stationPosition.pop()
	}
	renderItem(){
		const { getFieldProps } = this.props.form
		const {lists}=this.state
		return lists.map((item)=>{
			const AStyle=item.level=='A'?{backgroundColor:'#e84e40'}:{}
			const BStyle=item.level=='B'?{backgroundColor:'#ffa726'}:{}
			const CStyle=item.level=='C'?{backgroundColor:'#21b68a'}:{}
			return (
				<Link className='item' to={'/patrol/'+item.id}>
					<div className='left'>
						<Badge style={{...AStyle,...BStyle,...CStyle}} text={item.level} />
					</div>
					<div className='center'>{item.name}</div>
					<div 
						{...getFieldProps('station-'+item.id,{
							initialValue:item.finished,
						})}
						className='right'
					>
						{item.finished ?<span>已完成</span>:<span style={{color:"#888"}}>未完成</span>}
					</div>
				</Link>
			)
		})
	}
	handleMapPlan(){
		this.props.router.push({
			pathname:'patrolmap',
			state:{startXY:start_XY,endXY:end_XY,waypoints:stationPosition,makerArry:[]}
		})
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields((error,value)=>{
			const disabled=reverseBtnFormat(value)
			if(!disabled){
				this.props.router.goBack()
			}else{
				alert('巡检还未完成是否完成任务？','',[
					{text:'取消',onPress:()=>{}},
					{text:'确定',onPress:()=>{this.props.router.goBack()}}
				])
			}
		})
	}
	render(){
		return (
			<div className='patrolstation'>
				<div className='header'>
					<div className='text'>巡检电室</div>
					<div className='text'>是否完成</div>
				</div>

				<div className='content' style={{height:document.documentElement.clientHeight-89}}>
					
					{this.renderItem()}
					<div className='btn-box' onClick={this.handleMapPlan.bind(this)} >
						<Icon type='blue_map_icon' size='md' />
						<span>地图规划</span>
					</div>

				</div>

				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
				>
					巡检完成
				</Button>
			</div>
		)
	}
}

export default withRouter(connect()(createForm()(PatrolStation))) 