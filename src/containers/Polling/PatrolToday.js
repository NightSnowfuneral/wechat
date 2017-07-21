import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,Badge,Switch,Icon,Button  } from 'antd-mobile'
import { withRouter,Link } from 'react-router'
import { createForm } from 'rc-form'
import objectAssign from 'object-assign'
import Get from '../../commonFun/Get'
import Post from '../../commonFun/Post'
import {switchBtnFormat,isSelected} from '../../commonFun/Format'
import {changeLoading} from '../../actions'

const Item=List.Item
const Brief=Item.Brief
const get=new Get()
const post=new Post()

class PatrolToday extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			lists:[],
			disabled:false,
		}
	}
	async componentDidMount() {
		this.props.dispatch(changeLoading(true))
		const res=await get.taskstoday()
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({lists:res.tasks,disabled:res.tasks.length==0})
		}
	}
	
	renderItem(){
		const { getFieldProps } = this.props.form
		const {lists}=this.state
		return lists.map((item)=>{
			const AStyle=item.level=='A'?{backgroundColor:'#e84e40'}:{}
			const BStyle=item.level=='B'?{backgroundColor:'#ffa726'}:{}
			const CStyle=item.level=='C'?{backgroundColor:'#21b68a'}:{}
			return (
				<div className='item'>
					<div className='left'>
						<Badge style={{...AStyle,...BStyle,...CStyle}} text={item.level} />
					</div>
					<div className='center'>{item.name}</div>
					<div className='right'>
						<Switch 
							{...getFieldProps('task-'+item.id,{
								initialValue:item.selected,
								valuePropName: 'checked',
								onChange:this.handleSwitch.bind(this,'task-'+item.id)
							})}
							platform ='ios'
							disabled={item.finished}
						/>
					</div>
				</div>
			)
		})
	}
	async handleSwitch(key,state){
		this.props.form.validateFields(async (error,value)=>{
			const currentSwitch={[key]:state}
			const obj=objectAssign({},value,currentSwitch)
			const disabled=switchBtnFormat(obj)
			this.setState({disabled})
		})
		const id=key.split('-')[1]
		const selected=state?1:0
		const params={selected}

		await post.changeTodayTask(params,id)
		const res=await get.taskstoday()
		this.setState({lists:res.tasks})
	}
	handleSubmit(e){
		e.preventDefault()
		const lists=isSelected(this.state.lists)
		this.props.router.push({pathname:'/patrolstation',state:{lists}})
	}
	handleAddTaskClick(){
		this.props.router.push({
			pathname:'/patrolsearch',
			state:{todayTask:this.state.lists}
		})
	}
	render(){
		return (
			<div className='patrolToday'>
				<div className='header'>
					<div className='text'>巡检电室</div>
					<div className='text'>是否巡视</div>
				</div>
				<div className='content' style={{height:document.documentElement.clientHeight-89}}>
					{this.renderItem()}
					<div className='btn-box' onClick={this.handleAddTaskClick.bind(this)} >
						<Icon type='green_add_icon' size='md' />
						<span>新增任务</span>
					</div>
				</div>
				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
	            	disabled={this.state.disabled}
				>
					路线规划
				</Button>
			</div>
		)
	}
}


export default withRouter(connect()(createForm()(PatrolToday))) 
