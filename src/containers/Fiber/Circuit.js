import React,{Component} from 'react'
import { InputItem,List,Button,Picker,Icon,Toast } from 'antd-mobile'
import {connect} from 'react-redux'
import { createForm } from 'rc-form'
import { withRouter } from 'react-router'
import objectAssign from 'object-assign'
import { changeLoading,clearCircuit } from '../../actions'
import Post from '../../commonFun/Post'

const Item=List.Item
const post=new Post()
const type=[
	{label:'跳线',value:0},
	{label:'直连',value:1},
	{label:'其他',value:2}
]

class Circuit extends Component{
	constructor(props) {
		super(props)
		this.state={
			formData:props.circuit,
			stationCount:props.circuit.stationCount || 1,
		}
	}
	componentDidMount() {
		const {circuit}=this.props
		this.refs.scrollContainer.scrollTop=circuit.scrollTop || 0
	}

	handleSearchStation(id,name){
		const scrollTop=this.refs.scrollContainer.scrollTop
		this.props.form.validateFields(async (error,value)=>{
			this.props.router.push({
				pathname:'/plant',
				state:objectAssign({},{preveRouter:'circuit'},this.props.circuit,value,{stationId:id,stationName:name,stationCount:this.state.stationCount,scrollTop:scrollTop})
			})
		})
	}
	handleAddTaskClick(){
		let newStationCount=0
		const {stationCount}=this.state
		newStationCount=stationCount+1
		this.setState({
			stationCount:newStationCount
		})
	}
	renderPickerHeader(num){
		return '第'+parseInt(num+1)+'个厂站'
	}
	renderStation(){
		const {stationCount,formData}=this.state
		const {getFieldProps}=this.props.form
		let html=[]
		for(var i=0;i<stationCount;i++){
			html.push(
				<List renderHeader={this.renderPickerHeader.bind(this,i)} className='picker-list'>
					<Item 
					 	{...getFieldProps('station-id-'+i,{initialValue:formData['station-id-'+i] || null})}  
				 		extra={formData['station-name-'+i] || ''}
				 		arrow="horizontal" 
				 		onClick={this.handleSearchStation.bind(this,'station-id-'+i,'station-name-'+i)}
					 >
				 		厂站名称
					 </Item>
			         <Picker
		            	{...getFieldProps('station-type-'+i,{initialValue:formData['station-type-'+i] || null})} 
		            	data={type} 
		            	cols={1} 
		            	extra='' 
		            >
			          	<List.Item arrow="horizontal">连接类型</List.Item>
			        </Picker>
				</List>
			)
		}
		return html
	}
	valueFormat(obj){
		const {stationCount}=this.state
		let switchs=[]
		let stations=[]
		let keys=obj
		for(let key in keys){
			let arg1=key.split('-')[0]
			let arg2=key.split('-')[1]
			let arg3=parseInt(key.split('-')[2])
			let arg4=key.split('-')[3]
			if(arg1==='switch'){
				if(!switchs[arg3]){
					switchs[arg3]={}
				}
				if(keys[key]===null){
					switchs[arg3][arg2]=0
				}else if(arg4==='number'){
					switchs[arg3][arg2]=parseInt(keys[key])
				}else{
					switchs[arg3][arg2]=keys[key]
				}
				
			}
			else if(arg1==='station'){
				if(keys[key]===null){
					stations=stations
				}else{
					if(!stations[arg3]){
						stations[arg3]={}
					}
					if(keys[key] instanceof Array){
						stations[arg3][arg2]=keys[key][0]
					}else{
						stations[arg3][arg2]=keys[key]
					}
				}
			} 
		}
		return {
			switchs,
			stations	
		}
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{

			this.props.changeLoading(true)

			const data=this.valueFormat(value)
			const res=await post.circuit(data)
				
			this.props.changeLoading(false)

			if(res.code===200){
				Toast.success('线路新建成功',0.8,()=>{
					this.props.clearCircuit()
					this.props.form.resetFields()
					this.props.router.goBack()
				})
				
			}
		})
	}
	render(){
		const {getFieldProps}=this.props.form
		const {formData}=this.state
		return (
			<div className='circuit'>
				<div className='main' ref='scrollContainer' style={{height:document.documentElement.clientHeight-57}}>
					<List renderHeader={() => '启始交换机'} >
						<InputItem clear {...getFieldProps('switch-place-0',{initialValue:formData['switch-place-0'] || '' })} placeholder="请输入地点" >
				          	地点
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-name-0',{initialValue:formData['switch-name-0'] || '' })} placeholder="请输入交换机" >
				          	交换机
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-row-0-number',{initialValue:formData['switch-row-0-number'] || null })} placeholder="请输入槽位号" type='number'>
				          	槽位号
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-port-0-number',{initialValue:formData['switch-port-0-number'] || null })} placeholder="请输入端口号" type='number'>
				          	端口号
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-portName-0',{initialValue:formData['switch-portName-0'] || '' })} placeholder="请输入端口名称" >
				          	端口名称
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-sortID-0-number',{initialValue:formData['switch-sortID-0-number'] || null })} placeholder="请输入第几根芯" type='number'>
				          	第几根芯
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-lineName-0',{initialValue:formData['switch-lineName-0'] || '' })} placeholder="请输入线路名称" >
				          	线路名称
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-vlan-0',{initialValue:formData['switch-vlan-0'] || '' })} placeholder="请输入VLAN" >
				          	VLAN
				        </InputItem>
					</List>
					<List renderHeader={() => '终点交换机'} >
						<InputItem clear {...getFieldProps('switch-place-1',{initialValue:formData['switch-place-1'] || '' })} placeholder="请输入地点" >
				          	地点
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-name-1',{initialValue:formData['switch-name-1'] || '' })} placeholder="请输入交换机" >
				          	交换机
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-row-1-number',{initialValue:formData['switch-row-1-number'] || null })} placeholder="请输入槽位号" type='number'>
				          	槽位号
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-port-1-number',{initialValue:formData['switch-port-1-number'] || null })} placeholder="请输入端口号" type='number'>
				          	端口号
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-portName-1',{initialValue:formData['switch-portName-1'] || '' })} placeholder="请输入端口名称" >
				          	端口名称
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-sortID-1-number',{initialValue:formData['switch-sortID-1-number'] || null })} placeholder="请输入第几根芯" type='number'>
				          	第几根芯
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-lineName-1',{initialValue:formData['switch-lineName-1'] || '' })} placeholder="请输入线路名称" >
				          	线路名称
				        </InputItem>
				        <InputItem clear {...getFieldProps('switch-vlan-1',{initialValue:formData['switch-vlan-1'] || '' })} placeholder="请输入VLAN" >
				          	VLAN
				        </InputItem>
					</List>
					{this.renderStation()}
					<div className='btn-box' onClick={this.handleAddTaskClick.bind(this)} >
						<Icon type='green_add_icon' size='md' />
						<span>新增厂站</span>
					</div>
				</div>
				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
				>
					确定
				</Button>
			</div>
		)
	}
} 

const mapStateToProps = (state) =>({
	circuit:state.circuit
})
const mapDispatchToProps={
	changeLoading,
	clearCircuit
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(createForm()(Circuit)))  
