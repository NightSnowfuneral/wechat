import React,{Component} from 'react'
import { withRouter } from 'react-router'
import { List,InputItem,Button,SearchBar,Modal,Toast,Icon } from 'antd-mobile'
import { createForm } from 'rc-form'
import {connect} from 'react-redux'
import objectAssign from 'object-assign'
import Scott from '../commonFun/Scott'
import Post from '../commonFun/Post'
import Wechat from '../commonFun/Wechat'
import { changeLoading } from '../actions'
import {isEmptyObject} from '../commonFun/Format'
import ListViewBar from '../components/ListViewBar'
import AlertObj from '../commonFun/AlertObj'


const Item=List.Item
const Brief=Item.Brief
const alert=Modal.alert
const scott=new Scott()
const post=new Post()
const wechat=new Wechat()
let lct={}

class Mansion extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			stationName:props.location.state.station.name,
			stationLocation:[props.location.state.station.longitude,props.location.state.station.latitude],
			mansionNames:[],
			mansionRow:{},
			mansionName:'',
			floor:'',
			showMap:true,
			isLoading:false,
		}
	}
	componentDidMount() {
		this.createStationMap()
		this.createMansionMap()
	}
	componentDidUpdate(prevProps, prevState) {
		if(this.state.showMap && this.state!=prevState){
			this.createStationMap()
			this.createMansionMap()
		}
	}
	componentWillUnmount() {
		this.props.router.setState({
			scrollTop:this.props.location.state.scrollTop
		})
	}

	createStationMap(){
		const mapOpts={zoom:16,center:this.state.stationLocation}
		const markOpts={num:1,position:this.state.stationLocation}
		const map=scott.createMap('station',mapOpts)
		scott.createMarker(map,markOpts)
	}
	async createMansionMap(){
		const {mansionRow}=this.state
		lct={longitude:120.6567,latitude:28.00616}
		/*if(this.props.location.state.lct){
			lct=this.props.location.state.lct
		}else{
			lct=await wechat.wxGetLocation
		}*/

		let position=[]
		if(!isEmptyObject(mansionRow)){
			position=[mansionRow.location.lng,mansionRow.location.lat]
		}else{
			position=[lct.longitude,lct.latitude]
		}
		const mapOpts={zoom:16,center:position}
		const markOpts={position:position,num:1}
		const map=scott.createMap('mansion',mapOpts)
		scott.createMarker(map,markOpts)
	}

	handleSearchMansion(){
		this.setState({showMap:false})
	}
	async handleChange(value){
		this.setState({mansionNames:[],isLoading:true,mansionName:value})
		const res=await scott.searchMansion(value)
		if(value.length!=0 && res.status==='complete'){
			this.setState({mansionNames:res.result.poiList.pois})
		}
		this.setState({isLoading:false})

	}
	handleCancel(){
		this.setState({showMap:true})
	}
	handleRowClick(row){
		this.setState({
			showMap:true,
			mansionRow:row
		})

	}
	handleFloor(val){
		this.setState({floor:val})
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{
			const data={}
			const station={}

			data.stationID=this.props.location.state.station.id
			station.id=this.props.location.state.station.id.toString()
			if(!isEmptyObject(value.mansion)){
				data.building=value.mansion.name
				data.searchLongitude=parseFloat(value.mansion.location.lng)
				data.searchLatitude=parseFloat(value.mansion.location.lng)
				data.currentLongitude=parseFloat(lct.longitude)
				data.currentLatitude=parseFloat(lct.latitude)

				station.name=this.state.stationName
				station.latitude=value.mansion.location.lat.toString()
				station.longitude=value.mansion.location.lng.toString()
			}else{
				return alert('请先搜索大厦','',[
					{text:'知道了'}
				])
				
			}

			if(value.floor.length!==0){
				data.floor=parseInt(value.floor)
				station.floor=value.floor
			}else{
				return alert('请输入楼层','',[
					{text:'知道了'}
				])
			}
			this.props.dispatch(changeLoading(true))

			const res=await post.postMansion(data)

			this.props.dispatch(changeLoading(false))

			if(res.code===200){
				Toast.success('提交成功',0.8)
				this.props.router.replace({
					pathname:'/plant',
					state:objectAssign({},this.props.location.state,{station:station})
				})
			}

		})
	}
	listRenderRow(row){
		return <List
					key={row.id}
					className=''
				>
					<Item
						onClick={this.handleRowClick.bind(this,row)}
						thumb={<Icon type='gray_search_icon' size='md' />}
						multipleLine
					>
						{row.name}
						<Brief>{row.address}</Brief>
					</Item>
				</List>
	}
	render(){
		const {form}=this.props
		const getFieldProps=form.getFieldProps

		return (
			<div className='mansion'>
				{this.state.showMap?
					<div>
						<List
							renderHeader={() => '厂站地址'}
							className='map-container'
						>
							<Item>
								<h3>{this.state.stationName}</h3>
								<div style={{height:'150px'}} id='station'></div>
							</Item>
						</List>
						
						<List
							renderHeader={() => '大厦地址'}
							className='map-container'
						>
							<Item>
								<h3 
									{...getFieldProps('mansion',{
					            		initialValue:this.state.mansionRow,
					            		rules:[{required:true}]
					            	})}
									onClick={this.handleSearchMansion.bind(this)}
								>
									{!isEmptyObject(this.state.mansionRow)?this.state.mansionRow.name:'当前位置（点击搜索大厦）'}
								</h3>
								<div style={{height:'150px'}} id='mansion'></div>
								<InputItem
						            {...getFieldProps('floor',{
					            		initialValue:this.state.floor,
					            		rules:[{required:true}],
					            		onChange:this.handleFloor.bind(this)
					            	})}  
					            	type='number'
						            className='input'
						            maxLength='3'
						            value={this.state.floor}
					            >
					            	输入楼层：
					            </InputItem>
							</Item>
						</List>

						<Button 
							type='primary' 
							className="btn" 
							onClick={this.handleSubmit.bind(this)}
						>
							绑定
						</Button>
					</div>:
					<div>
						<SearchBar 
							onChange={this.handleChange.bind(this)}
							onCancel={this.handleCancel.bind(this)}
							placeholder='输入大厦名称' 
							autoFocus={true}
							value={this.state.mansionName}
						/>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.mansionNames} 
							isLoading={this.state.isLoading}
							noListHeight={44}
						/>
					</div>
				}
			</div>
		)
	}
}

export default withRouter(connect()(createForm()(Mansion)))