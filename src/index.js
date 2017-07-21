import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'
import routes from './routes'

const rootElement=document.getElementById('app')

ReactDOM.render(
	<Provider store={store}>
		{routes}
	</Provider>,
	rootElement
)
