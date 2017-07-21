import React,{Component} from 'react'
import {Link} from 'react-router'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import {List,Button,SearchBar,Toast,Modal} from 'antd-mobile'
import { createForm } from 'rc-form'
import objectAssign from 'object-assign'
import Get from '../../commonFun/Get'
import Post from '../../commonFun/Post'
import ListViewBar from '../../components/ListViewBar'
import {changeLoading} from '../../actions'
import {noSwitchFormat,filterArry,switchBtnFormat,switchFormat,searchFiter} from '../../commonFun/Format'

const Item=List.Item
const Brief=Item.Brief
const alert=Modal.alert
const get=new Get()
const post=new Post()

class PatrolSearch extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			showSearch:false,
			searchValue:'',
			stations:[],
			isFetching:false,
			lists:[],
			disabled:true,
			showCancelButton:false
		}
	}
	async componentDidMount() {
		const {state}=this.props.location
		this.props.dispatch(changeLoading(true))
		const res=await get.tasks()
		console.log(res)
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			const lists=filterArry(res.tasks,state.todayTask)
			this.setState({lists})
		}
	}
	handleCheckboxChange(key,e){
		this.props.form.validateFields((error,value)=>{
			const currentCheckbox={[key]:e.target.checked}
			const obj=objectAssign({},value,currentCheckbox)
			const disabled=switchBtnFormat(obj)
			this.setState({disabled})
		})
	}
	handleFocus(){
		this.setState({showSearch:true})
	}
	handleCancel(){
		this.setState({showSearch:false,searchValue:'',stations:[]})
	}
	handleChange(val){
		let stations=[]
		stations=searchFiter(this.state.lists,val)
		this.setState({searchValue:val,stations})
	}
	async handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields((error,value)=>{
			alert('确认完成任务添加','',[
				{text:'取消',onPress:()=>{}},
				{text:'确定',onPress:async ()=>{
					const tasks=switchFormat(value)
					const params={tasks}
					const res=await post.tasksToday(this.props.dispatch,params)
					if(res.code==200){
						Toast.success('添加成功',0.8,()=>{
							this.props.router.goBack()
						})
						
					}else{
						Toast.fail('添加失败',0.8)
					}
				}}
			])
		})
	}
	listRenderRow(row){
		const {getFieldProps}=this.props.form 
		const thumbStyle=row.avator?{backgroundImage:'url('+row.avator+')'}:{}
		return <List
					key={row.id}
					className='row-list'
				>
					<Item
						onClick={() => {} }
						extra={
							<input
								{...getFieldProps('station-'+row.id,{
									initialValue:false,
									onChange:this.handleCheckboxChange.bind(this,'station-'+row.id)
								})}
								defaultChecked={false}
								className='checkbox' 
								type="checkbox" 
							/>
						}
						thumb={<div style={thumbStyle} className='thumb'></div>}
					>
						{row.name}
						<Brief>巡视等级：<span style={{color:'#ff5722'}}>{row.level}</span></Brief>
					</Item>
				</List>
	}
	render(){
		return (
			<div className='patrolsearch'>
				<SearchBar 
					value={this.state.searchValue}
					placeholder='输入厂站名称'
					onFocus={this.handleFocus.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					onChange={this.handleChange.bind(this)}
				/>
				<div className='header'>未完成任务</div>
				{ !this.state.showSearch?
					<ListViewBar 
						renderRow={this.listRenderRow.bind(this)} 
						data={this.state.lists} 
						noListHeight={133} 
					/>:
					<ListViewBar 
						renderRow={this.listRenderRow.bind(this)} 
						data={this.state.stations} 
						noListHeight={133} 
						isLoading={this.state.isFetching}
					/>	
				}
				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
	            	disabled={this.state.disabled}
				>
					确定
				</Button>
			</div>
		)
	}
}

export default withRouter(connect()(createForm()(PatrolSearch))) 