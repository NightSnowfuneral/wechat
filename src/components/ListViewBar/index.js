import React,{Component} from 'react'
import { withRouter } from 'react-router'
import { ListView,ActivityIndicator } from 'antd-mobile'
import AlertObj from '../../commonFun/AlertObj'
import './listviewbar.css'

class ListViewBar extends Component{
	constructor(props) {
		super(props)
		
		let ds=new ListView.DataSource({
			rowHasChanged:(r1,r2)=>r1!=r2
		})
		this.state={
			dataSource:ds.cloneWithRows(props.data),
		}
	}
	componentDidMount() {
		this.refs.lv.refs.listview.scrollTo(0, this.props.scrollTop)
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource:this.state.dataSource.cloneWithRows(nextProps.data)
		})
	}
	renderFooter(){
		if(!this.props.isLoading && this.props.data.length==0){
			return <div className='no-list'>暂时没有数据</div>
		}else if(this.props.isLoading){
			return <ActivityIndicator 
						className='loadingMore' 
						size="large"
					/>
		}
	}
	handleScroll(e){
		if(this.props.handleScroll){
			this.props.handleScroll(e.target.scrollTop)
		}
	}
	render(){
		return (
			<div className='list-view-bar'>
				<ListView
					ref='lv'
					dataSource={this.state.dataSource}
					renderRow={this.props.renderRow.bind(this)}
					className='list-view'
					style={{
						height:document.documentElement.clientHeight-(this.props.noListHeight || 0) ,
						overflow:'auto',
					}}
					renderFooter={this.renderFooter.bind(this)}
					initialListSize={500}
					onScroll={this.handleScroll.bind(this)}
				/>
			</div>
		)
	}
}

export default withRouter(ListViewBar) 
