// https://github.com/bitfinexcom/ufx-ui/blob/staging/packages/bfx-containers/src/hooks/useInjectBfxData.js -> removed not required ap calls for HF

import { useEffect } from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { useSelector, useDispatch } from 'react-redux'
import { reduxActions, reduxSelectors } from '@ufx-ui/bfx-containers'

import { getSocket } from '../redux/selectors/ws'
import { isElectronApp } from '../redux/config'

const {
  requestCurrenciesInfo,
  requestSymbolDetails,
  WSConnectThrottled,
  WSDisconnect,
} = reduxActions

const { getWSConnected } = reduxSelectors

const useInjectBfxData = () => {
  const dispatch = useDispatch()
  const socket = useSelector(getSocket())
  /*
    electron-app: api will be fetched on localhost:45001, which will be available once api-server is started
    hosted-app: can fetch early without waiting for api-server
  */
  const isAPIServerConnected = !isElectronApp ? true : socket?.status === 'online'

  // start: fetch common data used across all ufx-containers
  useEffect(() => {
    if (isAPIServerConnected) {
      dispatch(requestCurrenciesInfo())
      dispatch(requestSymbolDetails())
    }
  }, [dispatch, isAPIServerConnected])

  // end: fetch common data used across all containers

  // start: websocket connection
  const isWSConnected = useSelector(getWSConnected)

  // connect/disconnect websocket
  useEffect(() => {
    if (!isWSConnected) {
      WSConnectThrottled(dispatch)
    }
  }, [dispatch, isWSConnected])

  // disconnect before page unload
  useBeforeunload(() => {
    dispatch(WSDisconnect())
  })

  useEffect(() => () => {
    if (isWSConnected) {
      dispatch(WSDisconnect())
    }
  }, [dispatch, isWSConnected])
  // end: websocket connection
}

export default useInjectBfxData
