import React,{ Component } from 'react'
import { Result, Icon,Button } from 'antd-mobile'
import { withRouter } from 'react-router'

class ResultPage extends Component{
	handleClick(){
		this.props.router.replace('/')
	}
	render(){
		return (
			<div className='resultpage'>
				<Result
				    img={<Icon size='lg' type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
				    title="绑定成功"
				    message="所提交内容已成功完成绑定"
				/>
				<Button 
					style={{marginLeft:'.3rem',marginRight:'.3rem',marginTop:'.3rem'}}
					className='btn' 
	            	type="primary"
					onClick={this.handleClick.bind(this)}
				>
					完成
				</Button>
			</div>
		)
	}
}

export default withRouter(ResultPage) 