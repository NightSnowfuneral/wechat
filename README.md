const { Component } = React
const { combineReducers, applyMiddleware, createStore } = Redux
const { Provider, connect } = ReactRedux
const sagaMiddleware = ReduxSaga.default
const { put, call } = ReduxSaga

// UTILITIES
const delay = timeout => (new Promise(resolve => {
  setTimeout(resolve, timeout)
}))

// REDUX
const store = (() => {
  // CONSTANTS
  const TICK = 'TICK'
  // ACTIONS
  const tick = (timeleft) => ({
    type: TICK,
    timeleft
  })
  // REDUCERS
  const timeleft = (state = 0, action) => {
    switch (action.type) {
      case TICK:
        return action.timeleft
      default:
        return state
    }
  }
  const reducer = combineReducers({
    timeleft
  })
  // SAGAS
  function* ticker() {
    const endDate = new Date(2016, 2, 1)
    while (true) {
      yield call(delay, 100)
      const timeleft = Math.floor((endDate - Date.now()) / 1000)
      yield put(tick(timeleft))
    }
  }
  
  return applyMiddleware(sagaMiddleware(
    ticker
  ))(createStore)(reducer)
})()

// CONTAINERS

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <ConnectedCountdownContainer />
      </div>
    )
  }
}

const minute = 60
const hour = 60 * minute
const day = 24 * hour
class CountdownContainer extends Component {
  render() {
    let { timeleft } = this.props
    
    const days = Math.floor(timeleft / day)
    timeleft = timeleft % day
    const hours = Math.floor(timeleft / hour)
    timeleft = timeleft % hour
    const minutes = Math.floor(timeleft / minute)
    timeleft = timeleft % minute
    const seconds = timeleft
    
    const props = { days, hours, minutes, seconds }
    return <Countdown {...props} />
  }
}
const mapStateToProps = state => state
const ConnectedCountdownContainer = connect(mapStateToProps)(CountdownContainer)

// COMPONENTS
const Header = () => (
  <h1>Countdown in React + Redux + Redux Saga</h1>
)
const Countdown = ({ days, hours, minutes, seconds }) => (
  <div className="countdown">{`${days}days, ${hours}hours, ${minutes}minutes, ${seconds}seconds`}</div>
)

// RENDER
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)