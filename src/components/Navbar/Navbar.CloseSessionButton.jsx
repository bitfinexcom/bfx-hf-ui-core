/* eslint-disable no-restricted-globals */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import { BFX_TOKEN_COOKIE } from '../../constants/cookies'
import { changeUIModalState } from '../../redux/actions/ui'

import WSActions from '../../redux/actions/ws'
import { isElectronApp } from '../../redux/config'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { getActiveStrategies, getAllAlgoOrdersArray } from '../../redux/selectors/ws'
import { removeCookie } from '../../util/cookies'
import closeElectronApp from '../../redux/helpers/close_electron_app'

const homeUrl = import.meta.env.VITE_ENVIRONMENT === 'staging'
  ? 'https://bfx-ui-api.staging.bitfinex.com/'
  : 'https://honey.bitfinex.com'

const CloseSessionButton = () => {
  const activeStrategies = useSelector(getActiveStrategies)
  const algoOrders = useSelector(getAllAlgoOrdersArray)

  const needToProcessBeforeCloseApp = !_isEmpty(activeStrategies) || !_isEmpty(algoOrders)

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const logout = () => {
    dispatch(WSActions.send(['auth.logout']))
    removeCookie(BFX_TOKEN_COOKIE)
    setTimeout(() => {
      // eslint-disable-next-line lodash/prefer-lodash-method
      location.replace(homeUrl)
    }, 1000)
  }

  const openCloseSessionModal = () => {
    if (needToProcessBeforeCloseApp) {
      dispatch(changeUIModalState(UI_MODAL_KEYS.CLOSE_SESSION_MODAL, true))
      return
    }
    closeElectronApp()
  }

  const buttonHandler = () => (isElectronApp ? openCloseSessionModal() : logout())

  return (
    <button
      type='button'
      className='hfui-navbar__close-session hfui-exchangeinfobar__button'
      onClick={buttonHandler}
    >
      {t(isElectronApp ? 'navbar.closeSession' : 'navbar.logout')}
    </button>
  )
}

export default CloseSessionButton
