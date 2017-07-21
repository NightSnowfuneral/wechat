import React,{Component} from 'react'
import { List } from 'antd-mobile'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import {changeLoading} from '../../actions'
import Get from '../../commonFun/Get'

const Item=List.Item
const get=new Get()

class Lists extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			lists:[]
		}
	}
	componentDidMount() {
		this.getListData()
	}
	renderItem(item){
		return (
			<Item 
				arrow="horizontal"
	            onClick={() => {this.props.router.push('/experiment/detail/'+item.id)}} 
	            wrap
          	>
          		{item.title}
          	</Item>
		)
	}
	renderMutiItem(lists){
		if(lists.length>0){
			return (
				lists.map((item,i)=>{
					return (
						this.renderItem(item)
					)
				})
			)
		}
	}
	async getListData(){
		this.props.dispatch(changeLoading(true))
		const res=await get.checkLists()
		if(res.code===200){
			this.setState({lists:res.list})
			this.props.dispatch(changeLoading(false))
		}		
	}
	render(){
		return (
			<div>
				<List renderHeader={() => '试验报告列表'}>
					{this.renderMutiItem(this.state.lists)}
				</List>
			</div>
		)
	}
}

export default  withRouter(connect()(Lists) )