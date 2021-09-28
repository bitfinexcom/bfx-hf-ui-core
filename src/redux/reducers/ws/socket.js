import types, { SOCKET_STATUS_MAP } from '../../constants/ws'

const initialState = () => ({
  [types.ALIAS_API_SERVER]: {
    status: SOCKET_STATUS_MAP.OFFLINE,
    lastActivity: null,
  },
  [types.ALIAS_DATA_SERVER]: {
    status: SOCKET_STATUS_MAP.OFFLINE,
    lastActivity: null,
  },
})

export default function (state = initialState(), action = {}) {
  const { type, payload = {} } = action
  const lastActivity = Date.now()

  switch (type) {
    case types.CONNECT: {
      const { alias = types.ALIAS_API_SERVER } = payload
      return {
        ...state,
        [alias]: {
          ...state[alias],
          status: SOCKET_STATUS_MAP.CONNECTING,
        },
      }
    }

    case types.CONNECTED: {
      const { alias = types.ALIAS_API_SERVER } = payload
      return {
        ...state,
        [alias]: {
          ...state[alias],
          status: SOCKET_STATUS_MAP.ONLINE,
          lastActivity,
        },
      }
    }

    case types.DISCONNECT: {
      const { alias = types.ALIAS_API_SERVER } = payload
      return {
        ...state,
        [alias]: {
          ...state[alias],
          status: 'disconnecting',
        },
      }
    }

    case types.DISCONNECTED: {
      const { alias = types.ALIAS_API_SERVER } = payload
      return {
        ...state,
        [alias]: {
          ...state[alias],
          status: SOCKET_STATUS_MAP.OFFLINE,
          lastActivity,
        },
      }
    }

    case types.SOCKET_ERROR: {
      const { alias = types.ALIAS_API_SERVER } = payload
      return {
        ...state,
        [alias]: {
          ...state[alias],
          status: SOCKET_STATUS_MAP.ONLINE,
          lastActivity,
        },
      }
    }

    default: {
      return state
    }
  }
}
