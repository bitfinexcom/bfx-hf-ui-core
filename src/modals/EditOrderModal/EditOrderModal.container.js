import { connect } from 'react-redux'
import _size from 'lodash/size'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import {
  getMaxOrderCounts,
  getUIModalStateForKey,
  getUIState,
} from '../../redux/selectors/ui'
import {
  getAuthToken,
  getFilteredAtomicOrdersCount,
  getAtomicOrders,
} from '../../redux/selectors/ws'
import { getMarkets } from '../../redux/selectors/meta'

import EditOrderModal from './EditOrderModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { LOG_LEVELS } from '../../constants/logging'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.EDIT_ORDER_MODAL),
  order: getUIState(state, UI_KEYS.orderToEdit),
  authToken: getAuthToken(state),
  atomicOrdersCount: _size(getAtomicOrders(state)),
  countFilterAtomicOrdersByMarket: getFilteredAtomicOrdersCount(state),
  maxOrderCounts: getMaxOrderCounts(state),
  markets: getMarkets(state),
})

const mapDispatchToProps = (dispatch) => ({
  changeVisibilityState: (visible) => dispatch(
    UIActions.changeUIModalState(UI_MODAL_KEYS.EDIT_ORDER_MODAL, visible),
  ),
  updateOrder: (authToken, order) => {
    dispatch(WSActions.send(['order.update', authToken, order]))
  },
  gaEditAO: () => {
    dispatch(GAActions.editAO())
  },
  cancelAlgoOrder: (authToken, gid) => {
    dispatch(WSActions.send(['algo_order.cancel', authToken, 'bitfinex', gid]))
  },
  submitAlgoOrder: (authToken, id, gid, data) => {
    dispatch(WSActions.submitAlgoOrder(authToken, id, data))

    // TODO: Instead of submitting orderData as a trace object, there should be a:
    // "updated [arr]: of objects, one per setting, under the format:
    // { setting [string], oldValue [string], newValue [string] }"
    dispatch(
      UIActions.logInformation(
        `User requested an update for the ${id} algorithmic order with ID ${gid}`,
        LOG_LEVELS.INFO,
        'ao_updated',
        data,
      ),
    )
  },
  updateRecurringAO: (authToken, payload) => dispatch(
    WSActions.send([
      'recurring_algo_order.update',
      authToken,
      'bitfinex',
      payload,
    ]),
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditOrderModal)
