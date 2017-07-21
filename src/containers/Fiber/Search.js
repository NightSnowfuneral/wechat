import React,{Component} from 'react'
import {SearchBar,List,Icon,Tabs} from 'antd-mobile'
import {connect} from 'react-redux'
import {changeLoading} from '../../actions'
import ListViewBar from '../../components/ListViewBar'
import Get from '../../commonFun/Get'
import Post from '../../commonFun/Post'

const Item=List.Item
const Brief=Item.Brief
const TabPane = Tabs.TabPane
const get=new Get()
const post=new Post()

class Search extends Component{
	constructor(props) {
		super(props);
		
		this.state={
			showCircuit:false,
			searchValue:'',
			listData:[],
			circuitData:[]
		}
	}

	handleChange(value){
		this.setState({searchValue:value})
		this.getListData(value)
	}
	handleCancel(){
		this.setState({showCircuit:true})
	}
	handleFocus(){
		this.setState({showCircuit:false,listData:[],searchValue:''})
	}
	handleRowClick(row){
		this.searchCircuit(row.id)
		this.setState({showCircuit:true,searchValue:row.name})
	}

	async getListData(value){
		this.props.dispatch(changeLoading(true))
		const res=await get.station(value)
		if(res.code===200){
			this.setState({listData:res.list})
			this.props.dispatch(changeLoading(false))
		}
	}
	async searchCircuit(id){
		const res=await post.searchCircuit(this.props.dispatch,id)
		if(res.code===200){
			this.setState({circuitData:res.result})
		}
		console.log(res)
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

	renderCircuit(item){
		return (
			<div className='tag'>
				<div className={item.type===1?'tag-left-active':'tag-left'}></div>
				<div className={item.type===1?'tag-right-active':'tag-right'}>{item.name}</div>
			</div>
		)
	}
	renderMutiCircuit(array){
		return(
			array.map((item)=>{
				return (
					this.renderCircuit(item)
				)
			})
		)
	}
	renderTabPane(item,key){
		return (
			<TabPane tab={'线路'+key} key={key}>
				<div>
					<List>
				        <Item
				            multipleLine
				            thumb={<Icon type='search' />}
				        >
				            {item.switchs[0].name}
				            <Brief>{item.switchs[0].name+'/'+item.switchs[0].row+'槽位/'+'光缆第'+item.switchs[0].sortID+'根芯/'+'VLAN'+item.switchs[0].vlan}</Brief>
				        </Item>
				    </List>
					{ item.stations.length>0 && 
						this.renderMutiCircuit(item.stations)
					}
					<List>
				        <Item
				            multipleLine
				            thumb={<Icon type='search' />}
				        >
				            {item.switchs[1].name}
				            <Brief>{item.switchs[1].name+'/'+item.switchs[1].row+'槽位/'+'光缆第'+item.switchs[1].sortID+'根芯/'+'VLAN'+item.switchs[1].vlan}</Brief>
				        </Item>
				    </List>
				</div>
			</TabPane>
		)
	}
	renderMultiTabPane(array){
		return (
			array.map((item,i)=>{
				return (
					this.renderTabPane(item,i+1)
				)
			})
		)
	}

	render(){
		return (
			<div>
				<SearchBar 
					onChange={this.handleChange.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					onFocus={this.handleFocus.bind(this)}
					placeholder='搜索' 
					value={this.state.searchValue}
				/>
				{ this.state.showCircuit ?
					<div style={{background:'#fff'}}>
						{ this.state.circuitData.length>0 && 
							<Tabs>
								{this.renderMultiTabPane(this.state.circuitData)}
							</Tabs>
						}
					</div>:
					<div>
						<ListViewBar 
							renderRow={this.listRenderRow.bind(this)} 
							data={this.state.listData} 
							isLoading={false}
							noListHeight={44}
						/>
					</div>
				}
			</div>
		)
	}
}

export default connect()(Search) 