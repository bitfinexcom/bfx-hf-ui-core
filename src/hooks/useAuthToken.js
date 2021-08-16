import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { replace } from 'connected-react-router'
import { isElectronApp } from '../redux/config'
import { getLocation } from '../redux/selectors/router'
import tokenStore from '../util/token_store'

export default () => {
  if (isElectronApp) {
    return
  }

  const dispatch = useDispatch()
  const location = useSelector(getLocation)
  const { authToken } = location.query

  useEffect(() => {
    if (authToken) {
      tokenStore.set(decodeURIComponent(authToken))

      // remove authToken query from url
      dispatch(replace(location.pathname))
    } else {
      // trigger getting the token
      tokenStore.get()
    }
  }, [])
}
