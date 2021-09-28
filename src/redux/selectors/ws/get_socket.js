import { createSelector } from 'reselect'

import getSockets from './get_sockets'
import t, { SOCKET_STATUS_MAP } from '../../constants/ws'

const EMPTY_OBJ = {}

export const getSocket = createSelector(
  [
    getSockets,
    (_, alias) => alias,
  ],
  (sockets, alias = t.ALIAS_API_SERVER) => sockets?.[alias] || EMPTY_OBJ,
)

export const isSocketConnected = createSelector(
  getSocket,
  (socket) => socket?.status === SOCKET_STATUS_MAP.ONLINE,
)
