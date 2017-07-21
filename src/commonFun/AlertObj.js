const AlertObj = (obj) =>{
	let output = ''
	for (let i in obj){
		let property = obj[i]
		output+=i + '=' +property + '\n'
	}
	window.alert(output)
}

export default AlertObj