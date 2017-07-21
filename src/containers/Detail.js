import React,{Component} from 'react'
import {withRouter,Link} from 'react-router'
import {connect} from 'react-redux'
import {List,Flex,TextareaItem,Accordion} from 'antd-mobile'
import {getTypeinDetail} from '../commonFun/AsyncFun'
import {isEmptyObject,userFormat} from '../commonFun/Format'
import AlertObj from '../commonFun/AlertObj'
import ImagePickerBar from '../components/ImagePickerBar'

const Item=List.Item
const Brief=Item.Brief
const Panel=Accordion.Panel
const marginStyle={
	marginRight:'0.8rem',
	marginLeft:'0.5rem'
}

class Detail extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			rocord:{},
		}
	}
	async componentDidMount() {
		const {params,dispatch}=this.props
		const res=await getTypeinDetail(dispatch,params.id)
		this.setState({rocord:res.rocord})
	}
	componentWillUnmount() {
		const {location}=this.props
		this.props.router.setState({
			scrollTop2:location.state.scrollTop2
		})
	}
	renderUsers(users){
		return users.map((item,i)=>{
			if(i<users.length-1){
				return (
					<Item extra={item.time}>
						{item.title}：{item.userName}
					</Item>
				)
			}
			
		})
	}
	render(){
		const {rocord}=this.state
		const {commonData}=this.props
		const thumbStyle=rocord.avator?{backgroundImage:'url('+rocord.avator+')'}:{}
		return (
			<div className='detail'>
				{ 	!isEmptyObject(rocord) &&
					<div>
						<List className='header-list'>
							<Item 
								thumb={<div style={thumbStyle} className='thumb'></div>} 
								multipleLine
								extra={rocord.status}
							>
					            {rocord.flows[rocord.flows.length-1].userName}
					            <Brief>{rocord.flows[rocord.flows.length-1].time}</Brief>
				       		</Item>
						</List>

						{ rocord.flows.length>1 && 
							<List renderHeader={() => '流程信息：'} className='center-list'>
								{this.renderUsers(rocord.flows)}
							</List>
						}

						<List renderHeader={() => '缺陷信息：'} className='footer-list'>
							<Item extra={userFormat(commonData.qxdj,rocord.qxdj)}>缺陷等级：</Item>
							<Item extra={userFormat(commonData.qxlx,rocord.qxlx)}>缺陷类型：</Item>
							<Item extra={rocord.station.name}>厂站名称：</Item>
							<div className='thumb-images'>
								<p className='header'>缩略图：{rocord.images.length==0 && '暂无缩略图'}</p>
								<div className='center'>
									<ImagePickerBar
										images={rocord.images}
										renderHeader={false}
										noRemoveIcon={rocord.images}
										urls={rocord.urls}
									/>
								</div>
							</div>
						</List>

						{ rocord.description && 
							<List renderHeader={() => '缺陷描述'} className='desc-list'>
								<TextareaItem
									value={rocord.description}	
						            rows={5}
						            count={100}
						            editable={false}
					            />
							</List>
						}
						

						{ rocord.content && 
							<List renderHeader={() => '缺陷处理'} className='desc-list'>
								<TextareaItem
									value={rocord.content}	
						            rows={5}
						            count={100}
						            editable={false}
					            />
							</List>
						}

						<List renderHeader={() => '消缺策略'}>
							<Item arrow="horizontal" onClick={() => {this.props.router.push({pathname:'/strategy',state:{description:rocord.description}})}}>消缺策略</Item>
						</List>

					</div>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	commonData:state.commonData,
})

export default withRouter(connect(mapStateToProps)(Detail)) 


{/*<div>
						<List className='header-list'>
							<Item 
								thumb={<div style={thumbStyle} className='thumb'></div>} 
								multipleLine
								extra={rocord.status}
							>
					            {rocord.flows[0].userName}
					            <Brief>{rocord.flows[0].time}</Brief>
				       		</Item>
						</List>
						{ rocord.flows.length>1 &&
							<List renderHeader={() => '流程信息：'} className='center-list'>
								{this.renderUsers(rocord.flows)}
							</List>
						}

						<List renderHeader={() => '缺陷信息：'} className='footer-list'>
							<Item extra={userFormat(commonData.qxdj,rocord.qxdj)}>缺陷等级：</Item>
							<Item extra={userFormat(commonData.qxlx,rocord.qxlx)}>缺陷类型：</Item>
							<Item extra={rocord.station.name}>厂站名称：</Item>
							<div className='thumb-images'>
								<p className='header'>缩略图：{rocord.images.length==0 && '暂无缩略图'}</p>
								<div className='center'>
									<ImagePickerBar
										images={rocord.images}
										renderHeader={false}
										noRemoveIcon={rocord.images}
										urls={rocord.urls}
									/>
								</div>
							</div>
						</List>

						<List renderHeader={() => '缺陷描述'} className='desc-list'>
							<TextareaItem
								value={rocord.description}	
					            rows={5}
					            count={100}
					            editable={false}
				            />
						</List>

						{ rocord.content && 
							<List renderHeader={() => '缺陷处理'} className='desc-list'>
								<TextareaItem
									value={rocord.content}	
						            rows={5}
						            count={100}
						            editable={false}
					            />
							</List>
						}
						<List renderHeader={() => '消缺策略'}>
							<Item arrow="horizontal" onClick={() => {this.props.router.push({pathname:'/strategy',state:{description:rocord.description}})}}>消缺策略</Item>
						</List>
					</div>*/}