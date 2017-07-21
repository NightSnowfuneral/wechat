import React from 'react'
import {Router,browserHistory,hashHistory} from 'react-router'
import Get from '../commonFun/Get'

const get=new Get()

const rootRoute={
	getComponent:(nextState,cb)=>{
		return require.ensure([],(require)=>{
			cb(null,require('../containers/App'))
		})
	},
	childRoutes:[
		{	
			path:'/',
			getComponent:async (nextState,cb)=>{
				return require.ensure([],(require)=>{
					cb(null,require('../containers/Dashboard'))
				})
			},
			indexRoute: {
		        getComponent: (nextState, cb) => {
		            return require.ensure([], (require) => {
	                	cb(null, require('../containers/Home'))
	                })
		        }
		    },
			childRoutes:[
				{ 
					path:'/fastpunch',
			      	getComponent: (nextState, cb) => {
				        return require.ensure([], (require) => {
			        	    cb(null, require('../containers/FastPunch'))
			            })
				    },
	      		},
		        { 
		        	path: '/normalpunch',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/NormalPunch'))
		                })
		            },
	            },
	            {
	            	path: '/typein',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/TypeIn'))
		                })
		            },
	            },
	            {
	            	path: '/dispose/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Dispose'))
		                })
		            },
	            },
	            {
	            	path: '/personal',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Personal'))
		                })
		            },
	            },
	            {	
	            	path: '/task',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Task'))
		                })
		            },
	            },
	            {
	            	path: '/detail/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Detail'))
		                })
		            },
	            },
	            {
	            	path: '/search',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Search'))
		                })
		            },
	            },
	            {
	            	path: '/plant',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Plant'))
		                })
		            },
	            },
	            {
	            	path: '/mansion',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Mansion'))
		                })
		            },
	            },
	            {
	            	path: '/strategy',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Strategy'))
		                })
		            },
	            },
	            {
	            	path: '/manage',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Manage'))
		                })
		            },
	            },
	            {
	            	path: '/role',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Role'))
		                })
		            },
	            },
	            {
	            	path: '/lookrole/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/LookRole'))
		                })
		            },
	            },
	            {
	            	path: '/role/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/EditRole'))
		                })
		            },
	            },
	            {
	            	path: '/user',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/User'))
		                })
		            },
	            },
	            {
	            	path: '/user/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/LookUser'))
		                })
		            },
	            },
	            {
	            	path: '/allotuser/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/AllotUser'))
		                })
		            },
	            },
	            {
	            	path: '/patroltask',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolTask'))
		                })
		            },
	            },
	            {
	            	path: '/patroltoday',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolToday'))
		                })
		            },
	            },
	            {
	            	path: '/patrol/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/Patrol'))
		                })
		            },
	            },
	            {
	            	path: '/station/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/StationHistory'))
		                })
		            },
	            },
	            {
	            	path: '/patrolcard/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolCard'))
		                })
		            },
	            },
	            {
	            	path: '/patrolsearch',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolSearch'))
		                })
		            },
	            },
	            {
	            	path: '/patrolstation',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolStation'))
		                })
		            },
	            },
	            {
	            	path: '/patrolmap',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Polling/PatrolMap'))
		                })
		            },
	            },
	            {
	            	path: '/station',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Station'))
		                })
		            },
	            },
	            {
	            	path: '/fiber/circuit',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Fiber/Circuit'))
		                })
		            },
	            },
	            {
	            	path: '/fiber/search',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Fiber/Search'))
		                })
		            },
	            },
	            {
	            	path: '/experiment/lists',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Experiment/Lists'))
		                })
		            },
	            },
	            {
	            	path: '/experiment/detail/:id',
		            getComponent: (nextState, cb) => {
		             	return require.ensure([], (require) => {
		                    cb(null, require('../containers/Experiment/Detail'))
		                })
		            },
	            },
			]
		},
		{
			path:'/bind',
			getComponent:(nextState,cb)=>{
				return require.ensure([],(require)=>{
					cb(null,require('../containers/Bind'))
				})
			}
		},
		{
			path:'/msg',
			getComponent:(nextState,cb)=>{
				return require.ensure([],(require)=>{
					cb(null,require('../containers/Msg'))
				})
			}
		},
		{
			path:'/result',
			getComponent:(nextState,cb)=>{
				return require.ensure([],(require)=>{
					cb(null,require('../containers/ResultPage'))
				})
			}
		}
	]
}

const routes=(
	<Router 
		history={hashHistory}
		routes={rootRoute}
	/>
)

export default routes