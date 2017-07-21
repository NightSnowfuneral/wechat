import React,{Component} from 'react'
import {Link} from 'react-router'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import {List,Button,Toast,Modal} from 'antd-mobile'
import { createForm } from 'rc-form'
import objectAssign from 'object-assign'
import {changeLoading} from '../../actions'
import {switchFormat,reverseBtnFormat} from '../../commonFun/Format'
import Get from '../../commonFun/Get'
import Post from '../../commonFun/Post'

const Item=List.Item
const Brief=Item.Brief
const alert=Modal.alert
const get=new Get()
const post=new Post()

class PatrolCard extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			cardList:[],
			disabled:true
		}
	}
	async componentDidMount() {
		this.props.dispatch(changeLoading(true))
		const res=await get.checkList()
		this.props.dispatch(changeLoading(false))
		if(res.code==200){
			this.setState({cardList:res.checklist})
		}
	}
	handleCheckboxChange(key,e){
		this.props.form.validateFields((error,value)=>{
			const currentCheckbox={[key]:e.target.checked}
			const obj=objectAssign({},value,currentCheckbox)
			const disabled=reverseBtnFormat(obj)
			this.setState({disabled})
		})
	}
	renderCard(){
		const { getFieldProps } = this.props.form
		const {cardList}=this.state
		return (
			cardList.map((l,i)=>{
				return (
					<div className='card'>
						<div className='header'>{l.entry}</div>
						{
							l.list.map((j,k)=>{
								return (
									<div className='item'>
										<div className='left'>
											{k+1}.{j.entry}
										</div>
										<input
											{...getFieldProps('card-'+i+k,{
												initialValue:false,
												onChange:this.handleCheckboxChange.bind(this,'card-'+i+k)
											})}
											defaultChecked={false}
											className='checkbox' 
											type="checkbox" 
										/>
									</div>
								)
							})
						}
					</div>
				)
			})
		)
	}
	async handleSubmit(e){
		e.preventDefault()
		const {params,dispatch}=this.props
		const res=await post.card(dispatch,params.id)
		if(res.code==200){
			Toast.success('提交成功',0.8,()=>{
				this.props.router.goBack()
			})
		}
	}
	render(){
		return (
			<div className='patrolcard'>
				<div className='content' style={{height:document.documentElement.clientHeight-52}}>
					{this.renderCard()}
				</div>
				<Button 
					className='btn' 
	            	type='primary'
	            	onClick={this.handleSubmit.bind(this)}
	            	disabled={this.state.disabled}
				>
					完成巡检
				</Button>
			</div>
		)
	}
}

export default withRouter(connect()(createForm()(PatrolCard))) 
