import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'

import types from '../../constants/ws'

function getInitialState() {
  return {}
}

export const getKey = ({ currency, context } = {}) => `${currency}_${context}`

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case types.SET_BALANCES: {
      const { balances = [] } = payload
      return balances
    }

    case types.SET_BALANCE: {
      const { balance = {} } = payload

      const key = getKey(balance)
      const prevBalance = _get(state, key)
      if (_isEqual(balance, prevBalance)) {
        return state
      }

      return {
        ...state,
        [key]: balance,
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
