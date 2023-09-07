import _filter from 'lodash/filter'
import _includes from 'lodash/includes'
import _map from 'lodash/map'

import WSTypes from '../../constants/ws'
import UITypes from '../../constants/ui'
import { notificationAdapter } from '../../adapters/ws'

function getInitialState() {
  return []
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = [] } = action

  switch (type) {
    case UITypes.DATA_NOTIFICATION:
    case WSTypes.DATA_NOTIFICATION: {
      const { notification = {} } = payload

      return [
        ...state,
        notificationAdapter(notification),
      ]
    }

    case UITypes.DATA_NOTIFICATIONS: {
      const { notifications } = payload

      const adaptedNotifications = _map(notifications, notificationAdapter)
      return [...state, ...adaptedNotifications]
    }

    case UITypes.REMOVE_NOTIFICATION: {
      const { cid } = payload
      return _filter(state, n => n.cid !== cid)
    }

    case UITypes.REMOVE_NOTIFICATIONS: {
      const { cids } = payload
      return _filter(state, n => !_includes(cids, n.cid))
    }

    case UITypes.CLEAR_NOTIFICATIONS: {
      return []
    }

    default: {
      return state
    }
  }
}

export default reducer
