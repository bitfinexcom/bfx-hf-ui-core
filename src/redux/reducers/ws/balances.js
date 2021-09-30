import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'
import _forEach from 'lodash/forEach'

import types from '../../constants/ws'
import { balanceAdapter } from '../../adapters/ws'

function getInitialState() {
  return {}
}

export const getKey = ({ currency, context } = {}) => `${currency}_${context}`

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_BALANCES: {
      const { balances = [] } = payload

      const transformed = {}
      _forEach(balances, balance => {
        const adapted = balanceAdapter(balance)
        transformed[getKey(adapted)] = adapted
      })

      return transformed
    }

    case types.DATA_BALANCE: {
      const { balance = [] } = payload
      const adapted = balanceAdapter(balance)

      const key = getKey(adapted)
      const prevBalance = _get(state, key)
      if (_isEqual(adapted, prevBalance)) {
        return state
      }

      return {
        ...state,
        [key]: adapted,
      }
    }

    case types.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}

export default reducer
