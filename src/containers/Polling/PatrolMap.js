import React,{Component} from 'react'
import {withRouter,Link} from 'react-router'
import {connect} from 'react-redux'
import Scott from '../../commonFun/Scott'

const scott=new Scott()
const mapHeight=document.documentElement.clientHeight

class PatrolMap extends Component{
	componentDidMount() {
		console.log(this.props.location.state)
		this.createDriving()
	}
	createDriving(){
		const {state}=this.props.location
		const mapOpts={zoom:16  ,center:state.startXY}
		const map=scott.createMap('map',mapOpts)
		scott.driving(map,state)
	}
	render(){
		return (
			<div className='patrolmap'>
				<div className='map' id='map' style={{height:mapHeight}}></div>
			</div>
		)
	}
}

export default withRouter(connect()(PatrolMap)) 