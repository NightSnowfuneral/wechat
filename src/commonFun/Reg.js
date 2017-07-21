import config from '../constants/Config'

export const trim=(str)=>{
	return str.replace(config.reg.trim, '')
}

export const authPhone=(phone)=>{
	const reg=config.reg.phone
	const flag=reg.test(phone)
	return flag
}