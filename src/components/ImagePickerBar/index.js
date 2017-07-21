import React,{Component} from 'react'
import {Icon} from 'antd-mobile'
import Wechat from '../../commonFun/Wechat'
import AlertObj from '../../commonFun/AlertObj'
import './imagepickerbar.css'

const wechat=new Wechat()

class ImagePickerBar extends Component{
	constructor(props) {
		super(props)
		
		this.state={
			renderHeader:props.renderHeader,
		}
	}

	async chooseImage(){
		const {images}=this.props
		if(images.length<9){
			const res=await wechat.wxChooseImage(images.length)
			const newImages=images.concat(res.localIds)

			this.props.onChange(newImages)
		}
	}
	clickImage(index){
		const {urls}=this.props
		wechat.wxPreviewImage(urls[index],urls)
	}
	removeImage(index,e){
		e.stopPropagation()
		let newImage=[]
		this.props.images.map((image,idx)=>{
			if(index!==idx){
				newImage.push(image)
			}
		})
		this.props.onChange(newImage)
	}
	render(){
		const images=this.props.images || []
		return (
			<div className='image-picker-bar'>
				{this.state.renderHeader &&
					<div 
						onClick={this.chooseImage.bind(this)}
						className='select' 
					>
						<span>图片</span>
						<Icon type='gray_camera_icon' size='lg' />
					</div>
				}
				<div className='images'>
					{images.map((item,index)=>
						<div className='item'>
							<img onClick={this.clickImage.bind(this,index)} src={item} width='100%' height='100%' />
							{(this.props.noRemoveIcon && this.props.noRemoveIcon[index])?
								null:
								<Icon onClick={this.removeImage.bind(this,index)} className='remove' type='gray_remove_icon' size='sm' />
							}
						</div>
						
					)}
				</div>
				
			</div>
		)
	}
}

ImagePickerBar.defaultProps={
	renderHeader:true
}

export default ImagePickerBar
