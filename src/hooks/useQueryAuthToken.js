import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { replace } from 'connected-react-router'
import { isElectronApp } from '../redux/config'
import { getLocation } from '../redux/selectors/router'
import WSActions from '../redux/actions/ws'
import tokenStore from '../util/token_store'

export default () => {
  if (isElectronApp) {
    return
  }

  const dispatch = useDispatch()
  const location = useSelector(getLocation)
  const { authToken: queryToken } = location.query

  useEffect(() => {
    const token = queryToken
      ? decodeURIComponent(queryToken)
      : tokenStore.get()

    if (queryToken) {
      tokenStore.set(token)

      // remove authToken query from url
      dispatch(replace(location.pathname))
    }

    if (token) {
      // set token in store
      dispatch(WSActions.recvAuthToken(token))
      dispatch(WSActions.recvAuthConfigured(true))
    }
  }, [])
}
