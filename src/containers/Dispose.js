import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import { Button,InputItem,Picker,List,TextareaItem,Flex,Toast,Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import objectAssign from 'object-assign'
import { changeLoading,clearDispose } from '../actions'
import Post from '../commonFun/Post'
import {isEmptyObject} from '../commonFun/Format'
import {getTypeinDetail} from '../commonFun/AsyncFun'
import AlertObj from '../commonFun/AlertObj'
import {uploadImage} from '../commonFun/AsyncFun'
import ImagePickerBar from '../components/ImagePickerBar'
import Delete from '../commonFun/Delete'

const alert=Modal.alert
const Item=List.Item
const post=new Post()
const dle=new Delete()

class Dispose extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			rocord:{},
			images:[],
			noImages:[]
		}
	}
	async componentDidMount() {
		let newRocord={}
		const {params,dispatch,dispose,location}=this.props
		const res=await getTypeinDetail(dispatch,params.id)
		if(location.action==='POP'){
			newRocord=objectAssign({},res.rocord,dispose)
		}else{
			newRocord=res.rocord
		}
		this.setState({rocord:newRocord,images:newRocord.images,noImages:res.rocord.images})
	}
	componentWillUnmount() {
		const {location}=this.props
		this.props.router.setState({
			scrollTop1:location.state.scrollTop1,
		})
	}

	handleSearchStation(){
		this.props.form.validateFields(async (error,value)=>{

			const newFormData={}
			let rocord=this.state.rocord
			newFormData.qxdj=value.qxdj[0] || 0
			newFormData.qxlx=value.qxlx[0] || 0
			newFormData.nextFlowUserID=value.nextFlowUserID?value.nextFlowUserID[0]:0
			newFormData.description=value.description || ''
			newFormData.images=value.images || []
			newFormData.content=value.content || ''

			if(rocord.station.id===0){
				rocord.station={}
			}
			this.props.router.push({
				pathname:'/plant',
				state:objectAssign({},{preveRouter:'dispose'},this.state.rocord,newFormData)
			})
		})
	}
	handleImageChange(images){
		this.setState({images})
	}
	handleHolds(e){
		e.preventDefault()
		const {rocord,noImages}=this.state
		const {state}=this.props.location
		this.props.form.validateFields(async (error,value)=>{

			this.props.dispatch(changeLoading(true))

			let uploadImagesBefore=[]
			let uploadImagesAfter=[]
			const data={}
			if(value.images.length>0){
				uploadImagesBefore=value.images.slice(noImages.length)
				if(uploadImagesBefore.length>0){
					uploadImagesAfter=await uploadImage(uploadImagesBefore)
				}
				
			}

			data.images=uploadImagesAfter
			data.id=parseInt(this.props.params.id)
			data.statusId=parseInt(state.statusId)
			data.qxdj=value.qxdj[0] || 0
			data.qxlx=value.qxlx[0] || 0
			data.description=value.description
			data.content=value.content
			data.stationID=value.stationID.toString() || '0'
			data.status='0'
			data.geoX='0'
			data.geoY='0'
			data.nextFlowTitleID=this.state.rocord.nextFlow.titleID
			data.nextFlowUserID=value.nextFlowUserID?value.nextFlowUserID[0]:rocord.nextFlowUserID
			console.log(data)

			const res=await post.dispose(data)

			this.props.dispatch(changeLoading(false))

			if(res.code==200){
				Toast.success('暂存成功',0.8,()=>{
					this.props.dispatch(clearDispose())
					this.props.form.resetFields()
					this.props.router.replace({pathname:'/task',query:{activeTab:'0'}})
					this.setState({images:[]})
				})
				
			}
		})
	}
	handleSubmit(e){
		e.preventDefault()
		const {rocord,noImages}=this.state
		const {state}=this.props.location
		this.props.form.validateFields(async (error,value)=>{
			if(!error){

				this.props.dispatch(changeLoading(true))

				let uploadImagesBefore=[]
				let uploadImagesAfter=[]
				const data={}
				if(value.images.length>0){
					uploadImagesBefore=value.images.slice(noImages.length)
					if(uploadImagesBefore.length>0){
						uploadImagesAfter=await uploadImage(uploadImagesBefore)
					}
					
				}

				data.images=uploadImagesAfter
				data.id=parseInt(this.props.params.id)
				data.statusId=parseInt(state.statusId)
				data.qxdj=value.qxdj[0]
				data.qxlx=value.qxlx[0]
				data.description=value.description
				data.content=value.content
				data.stationID=value.stationID.toString()
				data.status='1'
				data.geoX='0'
				data.geoY='0'
				data.nextFlowTitleID=this.state.rocord.nextFlow.titleID
				data.nextFlowUserID=value.nextFlowUserID?value.nextFlowUserID[0]:rocord.nextFlowUserID
				
				const res=await post.dispose(data)

				this.props.dispatch(changeLoading(false))

				if(res.code===200){
					Toast.success('提交成功',0.8,()=>{
						this.props.dispatch(clearDispose())
						this.props.form.resetFields()
						this.props.router.replace({pathname:'/task',query:{activeTab:'1'}})
						this.setState({images:[]})
					})
					
				}
				
			}else{
				const {getFieldError}=this.props.form
				const keys=['stationID','qxdj','nextFlowUserID','qxlx']
				let errors =null 
				for(let key of keys){
					if(error[key]){
						errors=getFieldError(key) ? error[key].errors[0].message : null
						break
					}
				}
				if(errors){
					alert(errors,'',[
						{text:'取消',onPress:()=>{console.log('取消')}},
						{text:'确定',onPress:()=>console.log('确定')}
					])
				}
			}
		})
	}
	handleRemove(){
		alert('撤销','确定撤销么？',
			[
				{text:'取消',onPress:()=>console.log('取消')},
				{text:'确定',onPress:async ()=>{
					this.props.dispatch(changeLoading(true))
					const res=await dle.record(this.props.params.id)
					if(res.code===200){
						this.props.dispatch(changeLoading(false))
						this.props.router.goBack()
					}
				}}
			]
		)
	}
	renderUsers(users){
		return users.map((user)=>{
			return (
				<InputItem
		            value={user.userName}
		            className="input"
		            editable={false}
	            >
	            	{user.title}：
	            </InputItem>
			)
		})
	}
	render(){
		const {commonData,form,location}=this.props
		const getFieldProps=form.getFieldProps
		const {statusId}=location.state
		const {rocord,noImages}=this.state
		let stationName=''
		if(rocord.station && rocord.station.name){
			stationName=rocord.station.name
		}

		return (
			<div>
				{!isEmptyObject(rocord) && 
					<div className='typein'>
						<List className='picker-list'>
							{this.renderUsers(rocord.flows)}
						</List>

						<List renderHeader={() => '缺陷信息：'} className='picker-list'>
							<Item 
							 	{...getFieldProps('stationID',{
				            		initialValue:rocord.station.id==0?'':rocord.station.id,
				            		rules:[{required:true,message:'请选择厂站'}]
				            	})}  
						 		extra={stationName}
						 		arrow="horizontal" 
						 		onClick={this.handleSearchStation.bind(this)}
							 >
						 		厂站名称：
							 </Item>
				            <Picker
				            	{...getFieldProps('qxdj',{
				            		initialValue:rocord.qxdj==0?'':[rocord.qxdj],
				            		rules:[{required:true,message:'请选择缺陷等级'}]
				            	})} 
				            	data={commonData.qxdj} 
				            	cols={1} 
				            	extra='' 
				            >
					          	<List.Item arrow="horizontal">缺陷等级：</List.Item>
					        </Picker>

					        { rocord.nextFlow.titleID!==0 &&
					        	<Picker 
						        	{...getFieldProps('nextFlowUserID',{
						        		initialValue:rocord.nextFlowUID==0?'':[rocord.nextFlowUID],
						        		rules:[{required:true,message:'请选择'+rocord.nextFlow.title}]
						        	})} 
					            	data={rocord.nextFlow.list} 
					            	cols={1} 
					            	extra='' 
					            >
						          	<List.Item arrow="horizontal">{rocord.nextFlow.title}：</List.Item>
						        </Picker>
					        }
					        
					        <Picker 
					        	{...getFieldProps('qxlx',{
					        		initialValue:rocord.qxlx==0?'':[rocord.qxlx],
					        		rules:[{required:true,message:'请选择缺陷类型'}]
					        	})} 
				            	data={commonData.qxlx} 
				            	cols={1} 
				            	extra='' 
				            >
					          	<List.Item arrow="horizontal">缺陷类型：</List.Item>
					        </Picker>
						</List>

						<List renderHeader={() => '缺陷描述：'}>
							<TextareaItem 
								{...getFieldProps('description', {
					                initialValue: rocord.description,
					            })}
					            placeholder="请输入缺陷描述内容："
					            rows={5}
					            count={300}
							/>
							<ImagePickerBar
								{...getFieldProps('images',{
					        		initialValue:this.state.images
					        	})} 
								images={this.state.images}
								urls={rocord.urls.concat(this.state.images.slice(noImages.length))}
								noRemoveIcon={noImages}
								onChange={this.handleImageChange.bind(this)}
							/>	
						</List>

						{ statusId>10 &&
							<List renderHeader={() => '处理结果：'}>
								<TextareaItem 
									{...getFieldProps('content', {
						                initialValue: rocord.content,
						            })}
						            placeholder="请输入处理结果内容"
						            rows={5}
						            count={300}
								/>
							</List>
						}

						{ statusId>10 &&
							<List renderHeader={() => '消缺策略'}>
								<Item arrow="horizontal" onClick={() => {this.props.router.push({pathname:'/strategy',state:{description:rocord.description}})}}>消缺策略</Item>
							</List>
						}

						<Flex className='flex-btn-group'>
							<Flex.Item><Button type='primary' className="btn-submit" onClick={this.handleSubmit.bind(this)}>提交</Button></Flex.Item>
							<Flex.Item><Button className='btn-holds' onClick={this.handleHolds.bind(this)}>暂存</Button></Flex.Item>		
							<Flex.Item><Button type='warning' onClick={this.handleRemove.bind(this)}>撤销</Button></Flex.Item>		
						</Flex>

						
					</div>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	commonData:state.commonData,
	dispose:state.dispose
})

export default withRouter(connect(mapStateToProps)(createForm()(Dispose)))
