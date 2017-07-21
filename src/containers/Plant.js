import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {SearchBar,List,Button,InputItem,Icon,Modal,Toast} from 'antd-mobile'
import {connect} from 'react-redux'
import objectAssign from 'object-assign'
import {setTypein,setDispose,setCircuit,getStationNames,changeLoading,setReport} from '../actions'
import Scott from '../commonFun/Scott'
import Wechat from '../commonFun/Wechat'
import AlertObj from '../commonFun/AlertObj'
import {isEmptyObject} from '../commonFun/Format'
import Post from '../commonFun/Post'
import ListViewBar from '../components/ListViewBar'

const Item=List.Item
const alert=Modal.alert
const post=new Post()
const scott=new Scott()
const wechat=new Wechat()
const newFormData={}
const mapHeight=document.documentElement.clientHeight
let lct={}

class Plant extends Component{
	constructor(props) {
		super(props)

		this.state={
			listData:[],
			showMap:true,
			searchValue:'',
			stationName:props.location.state.station?props.location.state.station.name:'',
			currentRow:props.location.state.station || {}
		}
	}
	async componentDidMount() {
		/*lct=await wechat.wxGetLocation()*/
		lct={longitude:120.6567,latitude:28.00616}
		this.createMap()
	}
	componentWillReceiveProps(nextProps) {
		this.setState({listData:nextProps.station.names})
	}
	componentDidUpdate(prevProps, prevState) {
		if(this.state.currentRow!=prevState.currentRow || prevState.showMap!=this.state.showMap){
			this.createMap()
		}
	}
	componentWillUnmount() {
		const {location}=this.props
		if(location.state.preveRouter=='typein'){
			this.props.setTypein(objectAssign({},this.props.location.state,newFormData))
		}else if(location.state.preveRouter=='dispose'){
			this.props.setDispose(objectAssign({},this.props.location.state,newFormData))
		}else if(location.state.preveRouter=='circuit'){
			this.props.setCircuit(objectAssign({},this.props.location.state,{[location.state.stationId]:newFormData.station?newFormData.station.id:null,[location.state.stationName]:newFormData.station?newFormData.station.name:''}))
		}else if(location.state.preveRouter=='report'){
			const obj=this.props.location.state.formData
			obj.stationID=newFormData.station?newFormData.station.id:null
			obj.stationName=newFormData.station?newFormData.station.name:''
			this.props.setReport(objectAssign({},this.props.location.state,{formData:obj}))
		}
		
	}

	createMap(){
		const {showMap,currentRow}=this.state
		const position=[lct.longitude,lct.latitude]
		const mapOpts={zoom:16  ,center:position}
		const map=scott.createMap('map',mapOpts)
		if(showMap){
			if(!isEmptyObject(currentRow)){
				const startXY=position
				const endXY=[currentRow.longitude,currentRow.latitude]
				const makerArry=[{position:startXY,text:'当前位置'},{position:endXY,text:'我在'+currentRow.floor+'楼'}]
				const drivingOpts={
					startXY,
					endXY,
					waypoints:[],
					makerArry,
				}
				scott.driving(map,drivingOpts)

			}else{
				const markOpts={
					position:position,
					className:'info-down',
					text:'当前位置',
					num:2,
				}
				scott.createMarker(map,markOpts)
			}
			
		}
	}
	handleFocus(){
		this.setState({showMap:false})
	}
	handleChange(value){
		this.props.getStationNames(value)

		this.setState({searchValue:value})
	}
	handleCancel(){
		this.setState({
				showMap:true,
			})
	}
	handleRowClick(row){
		if(row.binding){
			this.setState({
				showMap:true,
				stationName:row.name,
				currentRow:row
			})
		}else{
			this.props.router.replace({
				pathname:'/mansion',
				state:objectAssign({},this.props.location.state,{station:row},{lct})
			})
		}
	}
	listRenderRow(row){
		return <List
					key={row.id}
				>
					<Item
						onClick={this.handleRowClick.bind(this,row)}
						thumb={<Icon type='gray_search_icon' size='md' />}
					>
						{row.name}
					</Item>
				</List>
	}
	handleSubmit(e){
		e.preventDefault()

		const {currentRow}=this.state
		newFormData.station=currentRow
		this.props.router.goBack()
	}
	handleUnBind(e){
		e.preventDefault()
		const {currentRow}=this.state
		const {changeLoading}=this.props
		alert('你确定解除此厂站的绑定','',[
			{text:'取消',onPress:()=>{}},
			{text:'确定',onPress:async ()=>{
				const res=await post.unbind(changeLoading,currentRow.id)
				if(res.code===200){
					Toast.success(res.msg,0.8,()=>{
						this.props.router.replace({
							pathname:'/mansion',
							state:objectAssign({},this.props.location.state,{station:currentRow},{lct})
						})
					})
					newFormData.station={}
				}else{
					Toast.fail('解绑失败',0.8)
				}
			}}
		])
	}
	render(){	
		return (
			<div className='plant'>
				{	this.state.showMap?
					<div className='containers'>
						<InputItem
							placeholder='查找厂站（汉字/拼音）'
							editable={false}
							onFocus={this.handleFocus.bind(this)}
							value={this.state.stationName}
						>
							<Icon type='gray_search_icon' size='sm'/>
						</InputItem>

						<div className='map' id='map' style={{height:mapHeight}}></div>

						<Button 
							className='btn btn-submit' 
			            	type='primary'
			            	onClick={this.handleSubmit.bind(this)}
			            	disabled={!this.state.stationName}
						>
							确定
						</Button>
						<Button 
							className='btn btn-unbind' 
			            	type='warning'
			            	onClick={this.handleUnBind.bind(this)}
			            	disabled={!this.state.currentRow.allowBinding}
						>
							解除绑定
						</Button>
						
					</div>:
					<div>
						<SearchBar 
							onChange={this.handleChange.bind(this)}
							onCancel={this.handleCancel.bind(this)}
							placeholder='搜索' 
							autoFocus={true}
							value={this.state.searchValue}
						/>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.listData} 
							isLoading={this.props.station.isFetching}
							noListHeight={64}
						/>
						<p className='tip'>
							如果没有想要的厂站名称，请联系管理员添加
						</p>
					</div>
				}
				
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	station:state.station,
})
const mapDispatchToProps={
	getStationNames,
	setTypein,
	setDispose,
	setCircuit,
	changeLoading,
	setReport
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Plant))  