import objectAssign from 'object-assign'
import Ajax from './Ajax'
import config from '../constants/Config'

const Delete=function(){
	
}

Delete.prototype.role=function(id){
	const opts={}
	opts.url=config.apiUrl.role+'/'+id

	const ajax=new Ajax(opts)
	return ajax.delete()
				.then(res=>res)
}
Delete.prototype.record=function(id){
	const opts={}
	opts.url=config.apiUrl.record+'/'+id

	const ajax=new Ajax(opts)
	return ajax.delete()
				.then(res=>res)
}
export default Delete