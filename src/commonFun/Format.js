export const isEmptyObject=(obj)=>{
    for (var key in obj) {
        return false;
      }
      return true
}

export const userFormat=(userList,userId)=>{
	if(userList && userList.length>0){
		return userList.map((user)=>{
			if(user.value==userId){
				return user.label
			}
		})
	}
	return
}


export const switchFormat=(obj)=>{
	const arry=[]
	for(var key in obj){
		if(obj[key] && key.split('-')[1]){
			arry.push(parseInt(key.split('-')[1]))
		}
	}
	return arry
}
export const switchStateFormat=(id,arry)=>{
	let state=false
	if(arry && arry.length>0){
		for(var i of arry){
			if(i===id){
				state=true
			}
		}
	}
	return state
}

export const isSwitchFormat=(arry,lists)=>{
	let newArry=[]
	if(arry.length>0 && lists){
		for(var item of arry){
			for(var i of lists){
				if(item.id===i){
					newArry.push(item)
				}
			}
		}
	}
	return newArry
}
export const noSwitchFormat=(arry,lists)=>{
	let newArry=[]
	if(arry.length>0 && lists){
		if(lists.length==0){
			newArry=arry
		}else{
			for(var item of arry){
				for(var i of lists){
					if(item.id===i){
						break;
					}else if(i===lists[lists.length-1]){
						newArry.push(item)
					}
				}
			}
		}
		
	}
	return newArry
}

export const switchBtnFormat=(obj)=>{
	let allSwitchState=false
	const switchkeys=Object.keys(obj)
	for(let key of switchkeys){
		if(obj[key]){
			break
		}else{
			if(key===switchkeys[switchkeys.length-1]){
				allSwitchState=true
			}else{
				allSwitchState
			}
		}
	}
	return allSwitchState
}
export const reverseBtnFormat=(obj)=>{
	let allSwitchState=true
	const switchkeys=Object.keys(obj)
	for(let key of switchkeys){
		if(!obj[key]){
			break
		}else{
			if(key===switchkeys[switchkeys.length-1]){
				allSwitchState=false
			}else{
				allSwitchState
			}
		}
	}
	return allSwitchState
}

export const timeFormat=(upTime,downTime)=>{
	var s = parseInt((downTime-upTime)/1000)
	let days,daysText,hours,hoursText
	if(s > 86400){
        days = s / 60 / 60 / 24;
        daysText = Math.floor(days);
        hours = s / 60 / 60 - (24 * daysText);
        hoursText = Math.floor(hours);
        return daysText+'天'+hoursText+'时';
    }else if( s > 3600 && s <= 86400){
        hours = s / 60 / 60;
        hoursText = Math.floor(hours);
        
        return "0天"+hoursText+'时';
    }else{
       return "时间已超"
   } 
}

export const getPatrolStation=(lists)=>{
	return lists.filter(list=>{
		list.latitude=parseFloat(list.latitude)
		list.longitude=parseFloat(list.longitude)
		list.position=[list.latitude,list.longitude]
		list.text=list.name
		return !list.finished
	})
}

export const merge=(start_dist,left,right)=>{
	var result=[],il=0,ir=0

	while (il<left.length && ir<right.length) {
		if(Math.abs(left[il].latitude+left[il].longitude-start_dist)<Math.abs(right[ir].latitude+right[ir].longitude-start_dist)){
			result.push(left[il++])
		}else{
			result.push(right[ir++])
		}
	}
	return result.concat(left.slice(il)).concat(right.slice(ir))

}
export const mergeSort=(start_dist,arry)=>{
	if(arry.length<2){
		return arry
	}
	var middle=Math.floor(arry.length/2)
	var left=arry.slice(0,middle)
	var right=arry.slice(middle)
	var params=merge(start_dist,mergeSort(start_dist,left),mergeSort(start_dist,right))
	params.unshift(0,arry.length)
	arry.splice.apply(arry,params)
	return arry
}

export const getPatrolStationList=(start_dist,lists)=>{
	const newList=getPatrolStation(lists)
	return mergeSort(start_dist,newList)
}

export const getStationPosition=(lists)=>{
	const position=[]
	for(var list of lists){
		const arry=[]
		arry.push(list.latitude)
		arry.push(list.longitude)
		position.push(arry)
	}
	return position
}

export const filterArry=(a1,a2)=>{
	const arry=[]
	for(var i of a1){
		for(var j of a2){
			if(i.id==j.id){
				break
			}else if(j.id===a2[a2.length-1].id){
				arry.push(i)
			}
		}
	}
	return arry
}

export const isSelected=(lists)=>{
	return lists.filter((list)=>
		list.selected
	)
}

export const searchFiter=(lists,val)=>{
	let newLists=[]
	if(val==undefined || val==""){
		newLists=lists
	}else{
		for(let list of lists){
			let num=list.name.indexOf(val)
			if(num>0){
				newLists[newLists.length]=list
			}
		}
	}
	return newLists
}