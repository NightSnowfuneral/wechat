import objectAssign from 'object-assign'
import { changeLoading } from '../actions'
import Ajax from './Ajax'
import config from '../constants/Config'

const Post=function(){
	this.verificationOpts={url:config.apiUrl.verification}
	this.userOpts={url:config.apiUrl.msg}
	this.typein={url:config.apiUrl.typein}
	this.mansion={url:config.apiUrl.mansion}
	this.searchOpts={url:config.apiUrl.search}
	this.roleOpts={url:config.apiUrl.role}
	this.patrolHistoryOpts={url:config.apiUrl.patrolHistory}
	this.tasksTodayOpts={url:config.apiUrl.taskstoday}
	this.circuitOpts={url:config.apiUrl.circuit}
	this.searchCircuitOpts={url:config.apiUrl.searchCircuit}
	this.checkReportOpts={url:config.apiUrl.checkReport}
}
Post.prototype.verification=function(data){
	const opts=this.verificationOpts
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.post()
				.then(res=>res)
}
Post.prototype.user=function(data){
	const opts=this.userOpts
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.put()
				.then(res=>res)
}
Post.prototype.postTypein=function(data){
	const opts=this.typein
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.post()
				.then(res=>res)
}
Post.prototype.dispose=function(data){
	const opts=this.typein
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.put()
				.then(res=>res)
}
Post.prototype.postMansion=function(data){
	const opts=this.mansion
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.put()
				.then(res=>res)
}
Post.prototype.postSearch=function(data){
	const opts=this.searchOpts
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.post()
				.then(res=>res)
}
Post.prototype.role=async function(dispatch,data){
	const opts=this.roleOpts
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.post()

	dispatch(changeLoading(false))

	return res

}
Post.prototype.putRole=async function(dispatch,data,id){
	const opts={}
	opts.url=config.apiUrl.role+'/'+id
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.put()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.putUser=async function(dispatch,data,id){
	const opts={}
	opts.url='user/'+id+'/role'
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.put()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.putRoleUser=async function(dispatch,data,id){
	const opts={}
	opts.url='role/'+id+'/user'
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.put()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.changeTodayTask=async function(data,id){
	const opts={}
	opts.url=config.apiUrl.taskstoday+"/"+id
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	const res=await ajax.put()

	return res
}
Post.prototype.patrolHistory=async function(dispatch,data){
	const opts=this.patrolHistoryOpts
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.post()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.tasksToday=async function(dispatch,data){
	const opts=this.tasksTodayOpts
	opts.data=objectAssign({},data)

	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.put()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.unbind=async function(cl,id){
	const opts={}
	opts.url='resource/'+id+'/unbind'
	const ajax=new Ajax(opts)
	cl(true)

	const res=await ajax.put()

	cl(false)

	return res
}
Post.prototype.card=async function(dispatch,id){
	const opts={}
	opts.url='task/'+id
	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.put()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.circuit=async function(data){
	const opts=this.circuitOpts
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.post()
				.then(res=>res)
}
Post.prototype.searchCircuit=async function(dispatch,id){
	const opts=this.searchCircuitOpts
	opts.data={id:id}
	const ajax=new Ajax(opts)

	dispatch(changeLoading(true))

	const res=await ajax.post()

	dispatch(changeLoading(false))

	return res
}
Post.prototype.report=async function(data){
	const opts=this.checkReportOpts
	opts.data=objectAssign({},data)
	const ajax=new Ajax(opts)
	return ajax.post()
				.then(res=>res)
}
export default Post