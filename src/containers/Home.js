import React,{ Component } from 'react'
import { Link } from 'react-router'
import {connect} from 'react-redux'
import { Grid,Button,Icon } from 'antd-mobile'

class Home extends Component{
	renderItem(item,index){
		return (
			<div className="item">
	            <Link to={item.linkTo} query={item.query}>
	            	<Icon type={item.icon} size="lg"/>
	            	<p>{item.name}</p>
	            </Link>
	        </div>
		)
	}
	render(){
		const menus=this.props.home
		return (
			<div className='home'>
				<div className='banner'></div>
				{ menus.map((item,i)=>
					<div className='grid-box'>
						<div className='title'>{item.name}</div>
						<Grid 
							data={item.childrenModule} 
							columnNum={4}
					      	renderItem={this.renderItem.bind(this)}
					    />
					</div>
				)}
				
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	home:state.menu.home || [],
})

export default connect(mapStateToProps)(Home)