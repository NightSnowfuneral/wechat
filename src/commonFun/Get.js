import objectAssign from 'object-assign'
import Ajax from './Ajax'
import config from '../constants/Config'


const Get=function(){
	this.existOpts={url:config.apiUrl.exist}
	this.appIdOpts={url:config.apiUrl.appId}
	this.signatureOpts={url:config.apiUrl.signature}
	this.uarOpts={url:config.apiUrl.uar}
	this.commonDataOpts={url:config.apiUrl.commonData}
	this.taskOpts={url:config.apiUrl.task}
	this.searchOpts={url:config.apiUrl.search}
	this.stationOpts={url:config.apiUrl.station}
	this.organizationOpts={url:config.apiUrl.organization}
	this.privilegesOpts={url:config.apiUrl.privileges}
	this.roleOpts={url:config.apiUrl.role}
	this.rolesOpts={url:config.apiUrl.roles}
	this.userOpts={url:config.apiUrl.user}
	this.tasksOpts={url:config.apiUrl.tasks}
	this.taskstodayOpts={url:config.apiUrl.taskstoday}
	this.resourcesOpts={url:config.apiUrl.resources}
	this.searchResource={url:config.apiUrl.searchResource}
	this.checkListOpts={url:config.apiUrl.checkList}
	this.checkListsOpts={url:config.apiUrl.checkListS}
}
Get.prototype.appId=function(){
	const ajax=new Ajax(this.appIdOpts)
	return ajax.get()
				.then(res=>res.appid)
}
Get.prototype.signature=function(params){
	const opts=this.signatureOpts
	opts.params=objectAssign({},params,{url:config.apiUrl.path})
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>res.signature)
}
Get.prototype.exist=function(){
	const ajax=new Ajax(this.existOpts)
	return ajax.get()
				.then(res=>res.code==200)
}
Get.prototype.uar=function(){
	const ajax=new Ajax(this.uarOpts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.commonData=function(){
	const ajax=new Ajax(this.commonDataOpts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.task=function(params){
	const opts=this.taskOpts
	opts.params=objectAssign({},params)
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.typeinDetail=function(id){
	const opts={}
	opts.url=config.apiUrl.typein+'/'+id
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.search=function(params){
	const opts=this.searchOpts
	opts.params=objectAssign({},params)
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.station=function(value){
	const opts=this.stationOpts
	const params={name:value}
	opts.params=objectAssign(params)
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.organization=function(params){
	const opts=this.organizationOpts
	opts.params=objectAssign({},params)
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res.results
				})
}
Get.prototype.privileges=function(){
	const opts=this.privilegesOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.privilegeDetail=function(id){
	const opts={}
	opts.url=config.apiUrl.role+'/'+id
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.roles=function(){
	const opts=this.rolesOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.menu=function(name){
	const opts={}
	opts.url=config.apiUrl.menu+'/'+name
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.users=function(value){
	const opts=this.userOpts
	const params={name:value}
	opts.params=objectAssign({},params)
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>res)
}
Get.prototype.userDetail=function(id){
	const opts={}
	opts.url='user/'+id+'/role'
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.roleUser=function(id){
	const opts={}
	opts.url='role/'+id+'/user'
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.tasks=function(){
	const opts=this.tasksOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.taskstoday=function(){
	const opts=this.taskstodayOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.patrol=function(id){
	const opts={}
	opts.url='task/'+id
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.resources=function(id){
	const opts=this.resourcesOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.searchResources=function(value){
	const opts=this.searchResource
	const params={name:value}
	opts.params=params
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.checkList=function(){
	const opts=this.checkListOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.checkLists=function(){
	const opts=this.checkListsOpts
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
Get.prototype.checkItem=function(id){
	const opts={}
	opts.url='check_item_list/'+id
	const ajax=new Ajax(opts)
	return ajax.get()
				.then(res=>{
					return res
				})
}
export default Get