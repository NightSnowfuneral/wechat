import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import { Button,InputItem,Picker,List,TextareaItem,Flex,Toast,Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import objectAssign from 'object-assign'
import { changeLoading,clearTypein } from '../actions'
import Post from '../commonFun/Post'
import {uploadImage} from '../commonFun/AsyncFun'
import AlertObj from '../commonFun/AlertObj'
import ImagePickerBar from '../components/ImagePickerBar'

const alert=Modal.alert
const Item=List.Item
const post=new Post()

class TypeIn extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			images:[],
			formdata:{}
		}
	}
	componentDidMount() {
		if(this.props.location.action=='POP'){
			this.setState({formdata:this.props.typein,images:this.props.typein.images})
		}
	}

	handleImageChange(images){
		this.setState({images})
	}
	handleSearchStation(){
		this.props.form.validateFields(async (error,value)=>{
			const newFormData={}
			newFormData.qxdj=value.qxdj[0] || 0
			newFormData.qxlx=value.qxlx[0] || 0
			newFormData.handleUserID=value.handleUserID[0] || 0
			newFormData.description=value.description
			newFormData.images=value.images
			this.props.router.push({
				pathname:'/plant',
				state:objectAssign({},{preveRouter:'typein'},this.state.formdata,newFormData)
			})
		})
	}
	handleHolds(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{

			this.props.changeLoading(true)

			let newImages=[]
			const data={}
			if(value.images.length>0){
				newImages=await uploadImage(value.images)
			}
			data.images=newImages
			data.qxdj=value.qxdj[0] || 0
			data.qxlx=value.qxlx[0] || 0
			data.handleUserID=value.handleUserID[0] || 0
			data.nextFlowUserID=value.handleUserID[0] || 0
			data.description=value.description
			data.stationID=value.stationID.toString()
			data.status='0'
			data.geoX='0'
			data.geoY='0'
			data.nextFlowTitleID=this.props.commonData.nextFlow.titleID

			const res=await post.postTypein(data)

			this.props.changeLoading(false)

			if(res.code==200){
				Toast.success('暂存成功',0.8,()=>{
					this.props.clearTypein()
					this.props.form.resetFields()
					this.props.router.replace({pathname:'/task',query:{activeTab:'0'}})
					this.setState({images:[]})
				})
				
			}
			
		})
	}
	handleSubmit(e){
		e.preventDefault()
		this.props.form.validateFields(async (error,value)=>{
			if(!error){
				this.props.changeLoading(true)
				
				let newImages=[]
				const data={}
				if(value.images.length>0){
					newImages=await uploadImage(value.images)
				}
				data.images=newImages
				data.qxdj=value.qxdj[0] || 0
				data.qxlx=value.qxlx[0] || 0
				data.handleUserID=value.handleUserID[0] || 0
				data.nextFlowUserID=value.handleUserID[0] || 0
				data.description=value.description
				data.stationID=value.stationID.toString()
				data.status='1'
				data.geoX='0'
				data.geoY='0'
				data.nextFlowTitleID=this.props.commonData.nextFlow.titleID
				
				console.log(data)

				const res=await post.postTypein(data)
				
				this.props.changeLoading(false)

				if(res.code===200){
					Toast.success('提交成功，已到审核人任务列表',0.8,()=>{
						this.props.clearTypein()
						this.props.form.resetFields()
						this.props.router.replace({pathname:'/task',query:{activeTab:'1'}})
						this.setState({imgData:[]})
					})
				}
				
			}else{
				const {getFieldError}=this.props.form
				const keys=['stationID','qxdj','handleUserID','qxlx']
				let errors =null 
				for(let key of keys){
					if(error[key]){
						errors=getFieldError(key) ? error[key].errors[0].message : null
						break
					}
				}
				if(errors){
					alert(errors,'',[
						{text:'知道了'}
					])
				}
			}
		})
	}
	render(){
		const {commonData,form}=this.props
		const getFieldProps=form.getFieldProps
		const {formdata}=this.state
		let stationName=''
		if(formdata.station && formdata.station.name){
			stationName=formdata.station.name
		}
		console.log(commonData)
		return (
			<div className='typein'>
				<List className='picker-list'>
					<InputItem
			            value={commonData.userName}
			            className="input"
			            editable={false}
		            >
		            	填报人：
		            </InputItem>
				</List>

				<List renderHeader={() => '缺陷信息：'} className='picker-list'>
					

					 <Item 
					 	{...getFieldProps('stationID',{
		            		initialValue:formdata.station?formdata.station.id:'',
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
		            		initialValue:formdata.qxdj?[formdata.qxdj]:'',
		            		rules:[{required:true,message:'请选择缺陷等级'}]
		            	})} 
		            	data={commonData.qxdj} 
		            	cols={1} 
		            	extra='' 
		            >
			          	<List.Item arrow="horizontal">缺陷等级：</List.Item>
			        </Picker>
			        { commonData.nextFlow &&
			        	<Picker 
				        	{...getFieldProps('handleUserID',{
				        		initialValue:formdata.handleUserID?[formdata.handleUserID]:'',
				        		rules:[{required:true,message:'请选择'+commonData.nextFlow.title}]
				        	})} 
			            	data={commonData.nextFlow.list} 
			            	cols={1} 
			            	extra='' 
			            >
				          	<List.Item arrow="horizontal">{commonData.nextFlow.title}：</List.Item>
				        </Picker>
			        }
			        

			        <Picker 
			        	{...getFieldProps('qxlx',{
			        		initialValue:formdata.qxlx?[formdata.qxlx]:'',
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
			                initialValue:formdata.description,
			            })}
			            placeholder="请输入缺陷描述内容"
			            rows={5}
			            count={300}
					/>
					<ImagePickerBar
						{...getFieldProps('images',{
			        		initialValue:this.state.images
			        	})} 
						images={this.state.images}
						urls={this.state.images}
						onChange={this.handleImageChange.bind(this)}
					/>
				</List>

				<Flex className='flex-btn-group'>
					<Flex.Item><Button type='primary' className="btn-submit" onClick={this.handleSubmit.bind(this)}>提交</Button></Flex.Item>
					<Flex.Item><Button className='btn-holds' onClick={this.handleHolds.bind(this)}>暂存</Button></Flex.Item>			
				</Flex>
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	commonData:state.commonData,
	typein:state.typein
})
const mapDispatchToProps={
	changeLoading,
	clearTypein
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(createForm()(TypeIn))) 
