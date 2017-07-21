import React,{Component} from 'react'
import {connect} from 'react-redux'
import { List,Icon,InputItem,SearchBar } from 'antd-mobile'
import { withRouter } from 'react-router'
import ListViewBar from '../components/ListViewBar'
import {getRoles} from '../commonFun/AsyncFun'
import Get from '../commonFun/Get'
import { changeLoading } from '../actions'

const Item=List.Item
const Brief=Item.Brief
const get=new Get()

class Station extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			showSearch:false,
			station:[],
			resources:[],
			isFetching:false,
			searchValue:'',
			scrollTop:props.location.state?props.location.state.scrollTop:0
		}
	}
	componentDidMount() {
		this.getResources()
	}
	componentWillUnmount() {
		const {scrollTop}=this.state
		this.props.router.setState({
			scrollTop
		})
	}
	handleSetScrollTop(scrollTop){
		this.setState({
			scrollTop:scrollTop
		})
	}

	async getResources(){
		this.props.dispatch(changeLoading(true))
		const res=await get.resources()
		this.props.dispatch(changeLoading(false))
		this.setState({
			resources:res.list
		})
		
		
	}
	handleFocus(){
		this.setState({showSearch:true})
	}
	handleCancel(){
		this.setState({showSearch:false,searchValue:'',station:[]})
	}
	async handleChange(val){
		this.setState({station:[],isFetching:true,searchValue:val})
		const res=await get.searchResources(val)
		console.log(res)
		this.setState({station:res.list,isFetching:false})
	}
	listRenderRow(row){
		const thumbStyle=row.avator.length>0?{backgroundImage:'url('+row.avator+')'}:{}
		return <List
					key={row.id}
					className='item-list'
				>
					<Item
						onClick={()=>{this.props.router.push({pathname:'/mansion',state:{station:row}})}}
						thumb={<div style={thumbStyle} className='thumb'></div>}
						arrow={'horizontal'}
					>
						{row.name}
						<Brief>厂站等级：{row.level}</Brief>
					</Item>
				</List>
	}
	render(){
		return (
			<div className='station'>
				<SearchBar 
					placeholder='支持汉字拼音搜素' 
					onFocus={this.handleFocus.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					onChange={this.handleChange.bind(this)}
					value={this.state.searchValue}
				/>
				{!this.state.showSearch?
					<div className='station-list'>
						{this.state.resources.length>0 && 
							<ListViewBar 
								renderRow={this.listRenderRow.bind(this)} 
								data={this.state.resources} 
								noListHeight={44} 
								handleScroll={this.handleSetScrollTop.bind(this)}
								scrollTop={this.state.scrollTop}
							/>	
						}
					</div>:
					<div className='station-search'>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.station} 
							noListHeight={44} 
							isLoading={this.state.isFetching}
						/>	
					</div>
				}
			</div>
		)
	}
}

export default withRouter(connect()(Station))