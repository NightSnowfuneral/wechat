import { combineReducers } from 'redux'
import loading from './loading'
import phone from './phone'
import commonData from './commonData'
import current from './current'
import history from './history'
import station from './station'
import typein from './typein'
import dispose from './dispose'
import privileges from './privileges'
import users from './users'
import menu from './menu'
import search from './search'
import circuit from './circuit'
import report from './report'


const reducer = combineReducers({
	loading,
	phone,
	commonData,
	current,
	history,
	station,
	typein,
	dispose,
	privileges,
	users,
	menu,
	search,
	circuit,
	report,
})

export default reducer