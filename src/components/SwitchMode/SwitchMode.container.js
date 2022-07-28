import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import { getIsPaperTrading, getThemeSetting } from '../../redux/selectors/ui'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  changeTradingMode: (isPaperTrading) => {
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(UIActions.setMarketFromStore(isPaperTrading))
    dispatch(WSActions.recvBalances({ balances: [] }))
    dispatch(WSActions.recvPositions({ positions: [] }))
    dispatch(WSActions.recvOrders({ orders: [] }))
    dispatch(WSActions.changeMode(isPaperTrading))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
