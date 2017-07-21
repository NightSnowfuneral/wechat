import React,{Component} from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import { createForm } from 'rc-form'
import classNames from 'classnames'
import { Drawer,List,Radio,DatePicker,Picker,Button,Flex } from 'antd-mobile'
import moment from 'moment'
import {setSearch} from '../actions'
import ListViewBar from '../components/ListViewBar'
import Post from '../commonFun/Post'
import Get from '../commonFun/Get'
import {resultPickerData} from '../commonFun/AsyncFun'
import {setPickerChildren} from '../commonFun/Format'

const RadioItem = Radio.RadioItem
const Item=List.Item
const Brief =Item.Brief 
const post=new Post()
const get=new Get()
const nowDate=moment()
const initialState={
	isLoading:false,
	listData:[],
	maskState:false,
	qxlxState:false,
	qxdjState:false,
	drawerState:false,
	type:'',
	status:'',
	level:'',
	catchType:'',
	catchStatus:'',
	catchLevel:'',
	STDate:'',
	STMaxDate:nowDate,
	STMinDate:moment('2015-08-06'),
	ETDate:'',
	ETMaxDate:nowDate,
	ETMinDate:moment('2015-08-06'),
	pickerData:[],
	pickerValue:[],
	pickerCols:2,
}


class Search extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			...initialState,
			...props.search,
			scrollTop:props.location.state?props.location.state.scrollTop2:0
		}
	}
	componentWillUnmount() {
		this.props.dispatch(setSearch(this.state))
		this.props.router.setState({
			scrollTop2:this.state.scrollTop
		})
	}
	handleSetScrollTop(scrollTop){
		this.setState({
			scrollTop:scrollTop
		})
	}
	handlePanelClick(stateName){
		if(stateName=='drawerState'){
			this.refs.header.style.zIndex='auto'
		}else{
			this.refs.header.style.zIndex='100'
		}
		
		this.setState({
			maskState:!this.state[stateName],
			drawerState:false,
			qxlxState:false,
			qxdjState:false,
			[stateName]:!this.state[stateName]
		})
	}
	handleMaskClick(){
		this.setState({
			maskState:false,
			drawerState:false,
			qxlxState:false,
			qxdjState:false
		})
	}
	async handleRadioChange(groupName,value){
		this.setState({...initialState,isLoading:true,[groupName]:value,pickerData:this.state.pickerData})
		const data={[groupName]:value.toString()}
		const res=await post.postSearch(data)
		if(res.code==200){
			this.setState({listData:res.list,isLoading:false})
		}else{
			this.setState({listData:[],isLoading:false})
		}
	}
	renderPanel(items,groupName){
		if(items && items.length>0){
			return (
				<List className='panel-list'>
					{items.map((item,index)=>
						<RadioItem 
							key={item.value}
							checked={this.state[groupName]===item.value} 
							onChange={this.handleRadioChange.bind(this,groupName,item.value)}
						>
							{item.label}
						</RadioItem>
					)}
				</List>
			)
		}
	}
	handleDrawerRadioChange(e){
		/*this.setState({
			catchType:'',
			catchStatus:'',
			[e.target.name]:parseInt(e.target.value)
		})*/
		this.setState({
			[e.target.name]:parseInt(e.target.value)
		})
	}
	handleDateChange(dateName,date){
		let ETDate=''
		let STDate=''
		this.props.form.validateFields(async (error,value)=>{
			STDate=value.startTime.length==0?moment('2015-08-06'):this.state.STDate
			ETDate=value.endTime.length==0?nowDate:this.state.ETDate
		})
		if(dateName=='startTime'){
			this.setState({ETMinDate:date,STDate:date,ETDate})
		}else if(dateName=='endTime'){
			this.setState({STMaxDate:date,ETDate:date,STDate})
		}
	}
	handlePickerChange(val){
		const pickerValue=[...val]
		this.setState({pickerValue})
	}
	async handlePickerItemClick(){
		if(this.state.pickerData.length==0){
			const res = await get.organization()
			this.setState({pickerData:res})
		}
		
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{
			const data={}
			let state={}
			data.level=value.catchLevel=='0'?'':value.catchLevel.toString()
			data.type=value.catchType=='0'?'':value.catchType.toString()
			data.status=value.catchStatus=='0'?'':value.catchStatus.toString()
			data.startTime=value.startTime.length==0?'':moment(value.startTime).format('YYYY-MM-DD HH:mm:ss')
			data.endTime=value.endTime.length==0?'':moment(value.endTime).format('YYYY-MM-DD HH:mm:ss')
			data.id=value.id.length==0?'':value.id[value.id.length-1]
			state={...initialState,pickerData:this.state.pickerData,pickerValue:value.id,catchLevel:parseInt(value.catchLevel),catchType:parseInt(value.catchType),catchStatus:parseInt(value.catchStatus),STDate:value.startTime,ETDate:value.endTime}			
			const res=await post.postSearch(data)
			if(res.code==200){
				state.listData=res.list
			}
			this.setState({...state})
		})
	}
	handleResert(e){
		e.preventDefault()
		this.props.form.resetFields()
		let state={}
		state={...initialState,pickerData:this.state.pickerData,type:this.state.type,status:this.state.status,listData:this.state.listData,drawerState:true,maskState:true}
		this.setState({...state})
	}
	renderRadioItem(items,groupName){
		const {getFieldProps}=this.props.form

		if(items && items.length>0){
			return (
				<div
				    className='radio-box'
					{...getFieldProps(groupName, {
			            initialValue: this.state[groupName],
			            onChange:this.handleDrawerRadioChange.bind(this)
		            })} 
				>
					{ items.map((item,index)=>{
						return (
							<label key={index} className='my-radio'>
								<input 
									type="radio" 
									name={groupName}
									value={item.value}
									checked={item.value===this.state[groupName]}
								/>
								<span>{item.label}</span>
							</label>
						)
					})}
					<label className='my-radio'>
						<input 
							type="radio"
							name={groupName}
							value='0'
							checked={this.state[groupName]=='0'}
						/>
							<span>全部</span>
					</label>
				</div>
			)
		}
	}
	renderDrawer(){
		const {getFieldProps}=this.props.form
		const {commonData}=this.props

		return (
			<div className='box'>

				<div className='drawer-list'>
					<div className='drawer-list-header'>缺陷等级</div>
					<div className='drawer-list-body'>
						{this.renderRadioItem(commonData.qxdj,'catchStatus')}
					</div>
				</div>

				<div className='drawer-list'>
					<div className='drawer-list-header'>缺陷类型</div>
					<div className='drawer-list-body'>
						{this.renderRadioItem(commonData.qxlx,'catchType')}
					</div>
				</div>

				<div className='drawer-list'>
					<div className='drawer-list-header'>缺陷状态</div>
					<div className='drawer-list-body'>
						{this.renderRadioItem(commonData.status,'catchLevel')}
					</div>
				</div>

				<div className='drawer-list'>
					<div className='drawer-list-header'>缺陷时间</div>
					<div className='drawer-list-body'>
						<DatePicker 
							className="forss"
							{...getFieldProps('startTime', {
					            initialValue: this.state.STDate,
					            onChange:this.handleDateChange.bind(this,'startTime')
				            })}
				            mode="datetime"
				            minDate={this.state.STMinDate}
				            maxDate={this.state.STMaxDate}
				        >
				            <List.Item arrow="horizontal">开始时间</List.Item>
				        </DatePicker>
				        <div style={{marginTop:'.3rem'}}></div>
				        <DatePicker 
							className="forss"
							{...getFieldProps('endTime', {
					            initialValue:this.state.ETDate,
					            onChange:this.handleDateChange.bind(this,'endTime')
				            })}
				            mode="datetime"
				            minDate={this.state.ETMinDate}
				            maxDate={this.state.ETMaxDate}
				        >
				            <List.Item arrow="horizontal">结束时间</List.Item>
				        </DatePicker>
					</div>
					<div className='drawer-list'>
						<div className='drawer-list-header'>所属部门</div>
						<div className='drawer-list-body'>
							<Picker
								{...getFieldProps('id', {
						            initialValue:this.state.pickerValue,
						            onChange:this.handlePickerChange.bind(this)
					            })}
								data={this.state.pickerData}
								cols={this.state.pickerCols}
							>
								<List.Item 
									onClick={this.handlePickerItemClick.bind(this)} 
									arrow="horizontal" 
								>
									选择地区
								</List.Item>
							</Picker>
						</div>
					</div>

				</div>


				<Flex className='flex-btn-group'>
					<Flex.Item><Button type='primary' className="btn btn-submit" onClick={this.handleSubmit.bind(this)}>完成</Button></Flex.Item>
					<Flex.Item><Button className='btn btn-resert' onClick={this.handleResert.bind(this)} >重置</Button></Flex.Item>			
				</Flex>

			</div>
		)
	}
	renderListRow(row){
		const thumbStyle=row.image.length>0?{backgroundImage:'url('+row.image+')'}:{}
		return <List
					key={row.id}
					className='row-list'
				>
					<Item
						extra={row.status}
						onClick={() => this.props.router.push({pathname:'/detail/'+row.id,query:{statusId:row.statusId}})}
						thumb={<div style={thumbStyle} className='thumb'></div>}
					>
						{row.userName}
						<Brief>厂站：{row.stationName}</Brief>
						<Brief>时间：{row.createTime}</Brief>
					</Item>
				</List>
	}
	render(){
		const {commonData}=this.props

		return (
			<div className='search'>
				<div ref='header' className='header'>
					<ul className='items'>
						<li className='item' onClick={this.handlePanelClick.bind(this,'qxlxState')}>缺陷类型</li>
						<li className='item' onClick={this.handlePanelClick.bind(this,'qxdjState')}>缺陷等级</li>
						<li className='item' onClick={this.handlePanelClick.bind(this,'drawerState')}>综合查询</li>
					</ul>
					<div className={classNames('panel',{active:this.state.qxlxState})}>{this.renderPanel(commonData.qxlx,'type')}</div>
					<div className={classNames('panel',{active:this.state.qxdjState})}>{this.renderPanel(commonData.qxdj,'status')}</div>
					<div className={classNames('drawer',{active:this.state.drawerState})} style={{height:document.documentElement.clientHeight}}>{this.renderDrawer()}</div>
				</div>
				<ListViewBar 
					renderRow={this.renderListRow.bind(this)} 
					data={this.state.listData} 
					isLoading={this.state.isLoading}
					noListHeight={46}
					handleScroll={this.handleSetScrollTop.bind(this)}
					scrollTop={this.state.scrollTop}
				/>
				<div onClick={this.handleMaskClick.bind(this)} className={classNames('mask',{active:this.state.maskState})} ></div>
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	commonData:state.commonData,
	search:state.search
})

export default withRouter(connect(mapStateToProps)(createForm()(Search)))
