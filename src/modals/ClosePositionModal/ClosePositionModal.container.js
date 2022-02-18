import { connect } from 'react-redux'
import { prepareAmount } from 'bfx-api-node-util'
import Debug from 'debug'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getIsClosePositionModalVisible, getClosePositionModalData } from '../../redux/selectors/ui'
import { getMarketPair } from '../../redux/selectors/meta'
import { getAuthToken } from '../../redux/selectors/ws'
import orders from '../../orders'
import ClosePositionModal from './ClosePositionModal'

const debug = Debug('hfui:m:close-position')

const mapStateToProps = (state = {}) => ({
  visible: getIsClosePositionModalVisible(state),
  rowData: getClosePositionModalData(state),
  authToken: getAuthToken(state),
  getMarketPair: getMarketPair(state),
})

const mapDispatchToProps = dispatch => ({
  changeClosePositionModalState: (isVisible) => {
    dispatch(UIActions.changeClosePositionModalState(isVisible, {}))
  },
  closePosition: (authToken, position = {}) => {
    const { symbol, amount, basePrice } = position
    const { generateOrder } = orders.Market()

    const packet = generateOrder({
      amount: prepareAmount(-1 * amount),
      reduceonly: true,
    }, symbol, 'm')

    debug('closing position on %s %f @ %f', symbol, amount, basePrice)
    dispatch(WSActions.submitOrder(authToken, packet))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ClosePositionModal)
