import React,{Component} from 'react'
import {Tabs} from 'antd-mobile'
import {isEmptyObject} from '../commonFun/Format'
import lists from '../constants/Strategy'

const TabPane = Tabs.TabPane

class Strategy extends Component{
	constructor(props) {
		super(props);
		
		this.state={
			strategy:lists[0],
		}
	}
	componentDidMount() {

		const {state}=this.props.location
		const arry=lists.filter((item)=>
			item.phenomenon==state.description
		)
		if(arry.length>0){
			this.setState({
				strategy:arry[0]
			})
		}
		
	}
	render(){
		const {strategy}=this.state

		return (
			<div className='strategy'>
				{!isEmptyObject(strategy) && 
					<Tabs 
						className='task-tabs' 
						animated={false}
					>
						<TabPane tab='缺陷原因' key='0'>
							<p style={{paddingLeft:".3rem",fontSize:".36rem",lineHeight:".6rem"}}>
								{ strategy.cause.map((item,i)=>
									<span>{'策略'+(i+1+':'+item)}<br /></span>
								)}
							</p>
						</TabPane>
						<TabPane tab='处理方案' key='1'>
							<p style={{paddingLeft:".3rem",fontSize:".36rem",lineHeight:".6rem"}}>
								{ strategy.manage.map((item,i)=>
									<span>{'方案'+(i+1+':'+item)}<br /></span>
								)}
							</p>
						</TabPane>
						<TabPane tab='备品备件' key='2'>
							<p style={{paddingLeft:".3rem",fontSize:".36rem",lineHeight:".6rem"}}>
								{ strategy.spare.length>0? 
									strategy.spare.map((item,i)=>
										<span>{item}<br /></span>
									):
									<span>无需携带设备</span>
								}
							</p>
						</TabPane>
					</Tabs>
				}
			</div>
		)
	}
}

export default Strategy