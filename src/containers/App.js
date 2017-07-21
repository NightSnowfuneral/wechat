import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Toast} from 'antd-mobile'
import '../assets/css/app'

class App extends Component{
	componentWillReceiveProps(nextProps) {
		this.setLoading(nextProps.loading)
	}
	setLoading(loading){
		if(loading){
			Toast.loading('请稍后...',0)
		}else{
			Toast.hide()
		}
	}
	render(){
		return (
			<div className='app'>
				{this.props.children}
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	loading:state.loading,
})

export default connect(mapStateToProps)(App)