import objectAssign from 'object-assign'
import Get from './Get'

const Wechat=function(){
	this.get=new Get()
	this.commonParams={
		timestamp: Date.parse(new Date()) / 1000,
	    nonceStr: Math.random().toString(36).substr(2), 
	}

}
Wechat.prototype.wxConfig=async function(){
	const params=objectAssign({},this.commonParams)
	params.signature=await this.get.signature(params)
	params.appId=await this.get.appId()
	params.jsApiList=['openLocation','getLocation','chooseImage','previewImage','uploadImage']
	params.debug=false
	return new Promise((resolve,reject)=>{
		wx.config(params)
		wx.ready(resolve)
		wx.error(error=>reject(error.errMsg))
	})
}
Wechat.prototype.wxGetLocation=function(){
	return new Promise((resolve,reject)=>{
		wx.getLocation({
			type:'gcj02',
			success:res =>resolve(res),
			fail:error => reject(error.errMsg)
		})
	})
}

Wechat.prototype.wxChooseImage=function(count){
	return new Promise((resolve,reject)=>{
		wx.chooseImage({
			count: 9-count, // 默认9
		    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: ['album', 'camera'],
		    success:res=>resolve(res),
		    fail:error => reject(error.errMsg)
		})
	})
}
Wechat.prototype.wxPreviewImage=function(image,images){
	wx.previewImage({
	    current: image, // 当前显示图片的http链接
	    urls: images // 需要预览的图片http链接列表
	});
}
Wechat.prototype.wxUploadImage=function(localId){
	return new Promise((resolve,reject)=>{
		wx.uploadImage({
			localId:localId,
			isShowProgressTips: 0,
			success:res=>resolve(res),
			fail:error=>reject(error.errMsg)
		})
	})
}
export default Wechat


