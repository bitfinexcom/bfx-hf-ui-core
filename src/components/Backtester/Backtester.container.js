import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import WSActions from '../../redux/actions/ws'
import {
  getBacktestState, getBacktestData, getBacktestResults, getAuthToken,
} from '../../redux/selectors/ws'
import { getMarkets, getTickersObject } from '../../redux/selectors/meta'
import WSTypes from '../../redux/constants/ws'
import { getThemeSetting } from '../../redux/selectors/ui'

import Backtester from './Backtester'

const mapStateToProps = (state = {}) => ({
  backtest: getBacktestState(state),
  backtestData: getBacktestData(state),
  markets: getMarkets(state),
  tickers: getTickersObject(state),
  backtestResults: getBacktestResults(state),
  strategyContent: state.ui.content,
  backtestOptions: state.ws.backtest.backtestOptions || {},
  authToken: getAuthToken(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  dsExecuteBacktest: (from, to, symbol, tf, candles, trades, strategy) => {
    dispatch(WSActions.purgeBacktestData())
    dispatch(WSActions.send({
      alias: WSTypes.ALIAS_DATA_SERVER,
      data: ['exec.str', ['bitfinex', from, to, symbol, tf, candles, trades, true, strategy, uuidv4()]],
    }))
    dispatch(WSActions.setBacktestLoading())
  },
  setBacktestOptions: options => {
    dispatch(WSActions.setBacktestOptions(options))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Backtester)
