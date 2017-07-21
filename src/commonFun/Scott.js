import objectAssign from 'object-assign'

const Scott=function(){}

Scott.prototype.servicerConfig=function(){
	return new Promise((resolve,reject)=>{
		AMap.service(['AMap.Driving'],()=>{
			resolve()
		})
	})
}

Scott.prototype.createMap=function(mapContainerName,opts){
	return new AMap.Map(mapContainerName,opts)
}

Scott.prototype.searchDriving=function(opts,driving){
	return new Promise((resolve,reject)=>{
		driving.search(opts.startXY,opts.endXY,{waypoints:opts.waypoints},(status,result)=>{
			resolve(result)
		})
	})	
}

Scott.prototype.driving=async function(mapContainer,opts){
	await this.servicerConfig()
	const drivingOpts={
			policy:AMap.DrivingPolicy.LEAST_TIME,
            map:mapContainer
		}
	const driving=new AMap.Driving(drivingOpts)
	
	await this.searchDriving(opts,driving)
	if(opts.makerArry && opts.makerArry.length>0){
		opts.makerArry.map((item)=>{
			const markOpts={
				position:item.position,
				className:'info-down',
				text:item.text,
				num:3,
			}
			this.createMarker(mapContainer,markOpts)
		})
	} 
	
}

Scott.prototype.createMarker=async function(mapContainer,opts){
	let markOpts={map:mapContainer,position:opts.position}
	if(opts.num==1){
		markOpts.offset=new AMap.Pixel(0,0)
		new AMap.Marker(markOpts)
	}
	if(opts.num==2){
		for(let i=0;i<2;i++){
			if(i==0){
				markOpts.offset=new AMap.Pixel(0,0)
			}else{
				markOpts.content="<div class="+opts.className+">"+opts.text+"</div>"
				markOpts.offset=new AMap.Pixel(-40,-35)
			}
			new AMap.Marker(markOpts)
		}
	}
	if(opts.num==3){
		markOpts.content="<div class="+opts.className+">"+opts.text+"</div>"
		markOpts.offset=new AMap.Pixel(-40,-65)
		new AMap.Marker(markOpts)
	}
	
}


Scott.prototype.placeSearch=function(placeSearchOpts){
	return new Promise((resolve,reject)=>{
		AMap.service('AMap.PlaceSearch',()=>{
		    resolve (new AMap.PlaceSearch(placeSearchOpts))
		})
	})
}
Scott.prototype.searchMansion=async function(keyText){
	const placeSearchOpts={
		type:'公司企业|地名地址信息|商务住宅|公共设施',
		city:'温州'
	}
	const placeSearch=await this.placeSearch(placeSearchOpts)
	return new Promise((resolve,reject)=>{
		placeSearch.search(keyText,(status,result)=>{
			const res={status,result}
			resolve(res)
		})
	})
}

export default Scott
