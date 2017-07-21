import React,{Component} from 'react'
import { List,TextareaItem,Popup,Radio,Button,InputItem,Toast } from 'antd-mobile'
import {connect} from 'react-redux'
import objectAssign from 'object-assign'
import { withRouter } from 'react-router'
import {changeLoading,clearReport} from '../../actions'
import Get from '../../commonFun/Get'
import Post from '../../commonFun/Post'
import {isEmptyObject} from '../../commonFun/Format'

const Item=List.Item
const RadioItem = Radio.RadioItem
const get=new Get()
const post=new Post()
const RadioData=[
	{value:0,label:'不合格'},
	{value:1,label:'合格'},
	{value:2,label:'其他'},
]

class PopupList extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			data:{
				result:props.data.result,
				comment:props.data.comment,
				id:props.data.id
			}
		}
	}
	handleChange(argName,value){
		const newData=this.state.data
		newData[argName]=value

		this.setState({
			data:newData
		})
	}
	handleSubmit(){
		this.props.changeFormLists(this.state.data)
		this.props.onClose()
	}
	render(){
		const {data}=this.state
		return (
			<div>
				<List renderHeader={() => '检查结果'}>
			       { RadioData.map((item,i)=>
			       		<RadioItem 
			       			key={item.value} 
			       			checked={data.result === item.value}
			       			onChange={this.handleChange.bind(this,'result',item.value)}
			       		>
			       			{item.label}
			       		</RadioItem>
			        )}
			    </List>
			    <List renderHeader={() => '备注'}>
			    	<TextareaItem 
			    		rows={3}
			    		placeholder='请输入...'
			    		defaultValue={data.comment}
			    		onChange={this.handleChange.bind(this,'comment')}
			    	>
			    		
			    	</TextareaItem>
			    </List>
			    <Button 
	            	style={{margin:'.3rem'}}
	            	type="primary"
	            	onClick={this.handleSubmit.bind(this)}
	            >
	            	确认
	            </Button>
			</div>
		)
	}	
}

class Detail extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			lists:[],
			formData:{
				listID:parseInt(props.params.id),
				stationName:'',
				stationID:null,
				model:'',
				factory:'',
				list:[],
			}
		}
	}

	async componentDidMount() {
		await this.getListData()

		const {report,location}=this.props
		if(location.action==='POP' && !isEmptyObject(report)){
			this.refs.scrollContainer.scrollTop=report.scrollTop || 0
			this.setState({formData:report.formData})
		}
	}
	handleSearchStation(){
		const scrollTop=this.refs.scrollContainer.scrollTop
		this.props.router.push({
			pathname:'/plant',
			state:objectAssign({},{preveRouter:'report',scrollTop:scrollTop,formData:this.state.formData})
		})
	}
	matchItemId(id){
		const lists=this.state.formData.list
		return lists.filter((item)=>item.id===id)

	}
	changeFormLists(item){
		const newFormData=this.state.formData
		const lists=newFormData.list

		if(lists.length>0){
			for(let list of lists){
				if(list.id===item.id){
					list.result=item.result
					list.comment=item.comment
					break
				}else if(list.id===lists[lists.length-1].id){
					lists.push(item)
				}
			}
		}else{
			lists.push(item)
		}

		newFormData.list=lists
		this.setState({formData:newFormData})
	}
	renderMutiItem(childs){
		return childs.map((child)=>{
			const item=this.matchItemId(child.id)
			let renderExtra=''
			if(item.length>0){
				if(item[0].result===0){
					renderExtra=<div style={{color:'#D53726'}}>不合格</div>
				}else if(item[0].result===1){
					renderExtra=<div style={{color:'#009446'}}>合格</div>
				}else{
					renderExtra=<div>其他</div>
				}
			}
			return (
				<Item 
					extra={renderExtra}
					arrow="horizontal"
		            onClick={() => {this.handleClick(child.id)}} 
		            wrap
	          	>
	          		{child.title}
	          	</Item>
			)
		})
	}
	renderMutiList(lists){
		if(lists.length>0){
			return (
				lists.map((list,i)=>{
					return (
						<List renderHeader={() => list.title}>
							{this.renderMutiItem(list.child)}
						</List>
					)
				})
			)
		} 
	}
	renderOther(){
		return (
			<List renderHeader={() => '其他信息'} className='picker-list'>
				<InputItem
					value={this.state.formData.model}
					onChange={this.handleInputItemChange.bind(this,'model')}
				>
		          	型号
		        </InputItem>
		        <InputItem
		        	value={this.state.formData.factory}
		        	onChange={this.handleInputItemChange.bind(this,'factory')}
		        >
		          	厂家人员
		        </InputItem>
		        <Item 
			 		extra={this.state.formData.stationName}
			 		arrow="horizontal" 
			 		onClick={this.handleSearchStation.bind(this)}
				 >
				 	厂站名称
				</Item>
			</List>
		)
	}
	handleInputItemChange(argName,val){
		const newFormData=this.state.formData
		newFormData[argName]=val
		this.setState({formData:newFormData})
	}
	handleClick(id){
		let initialData={
			result:0,
			comment:'',
			id:id
		}
		let matchItemData=this.matchItemId(id)
		const data=objectAssign({},initialData,matchItemData[0])
		Popup.show(<PopupList data={data} changeFormLists={this.changeFormLists.bind(this)} onClose={() => Popup.hide()} />,{animationType: 'slide-up'})
	}
	async getListData(){
		const {params}=this.props
		this.props.dispatch(changeLoading(true))
		const res=await get.checkItem(params.id)
		if(res.code===200){
			this.setState({lists:res.items})
			this.props.dispatch(changeLoading(false))
		}	
	}
	async handleSubmit(){
		const data=this.state.formData

		this.props.dispatch(changeLoading(true))

		const res=await post.report(data)

		this.props.dispatch(changeLoading(false))
		if(res.code===200){
			Toast.success('线路新建成功',0.8,()=>{
				this.props.dispatch(clearReport())
				this.props.router.goBack()
			})
			
		}
	}
	render(){
		return (
			<div className='em-detail'>
				<div className='content' ref='scrollContainer' style={{height:document.documentElement.clientHeight-57}}>
					{this.renderMutiList(this.state.lists)}
					{this.renderOther()}
				</div>
				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
				>
					确认
				</Button>
			</div>
		)
	}
}

const mapStateToProps = (state) =>({
	report:state.report
})

export default withRouter(connect(mapStateToProps)(Detail))