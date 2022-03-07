/* eslint-disable consistent-return */
import React, {
  useEffect, Suspense, lazy, useCallback,
} from 'react'
import {
  Route, Switch, Redirect, useLocation,
} from 'react-router'
import PropTypes from 'prop-types'

import { THEMES, SETTINGS } from '../../redux/selectors/ui'
import useInjectBfxData from '../../hooks/useInjectBfxData'
import StrategyEditorPage from '../../pages/StrategyEditor'
import NotificationsSidebar from '../NotificationsSidebar'
import AppUpdate from '../AppUpdate'
import closeElectronApp from '../../redux/helpers/close_electron_app'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'

import './style.css'

// const StrategyEditorPage = lazy(() => import('../../pages/StrategyEditor'))
const TradingPage = lazy(() => import('../../pages/Trading'))
const MarketDataPage = lazy(() => import('../../pages/MarketData'))
const AuthenticationPage = lazy(() => import('../../pages/Authentication'))

const TradingModeModal = lazy(() => import('../../modals/TradingModeModal'))
const BadConnectionModal = lazy(() => import('../../modals/BadConnectionModal'))
const OldFormatModal = lazy(() => import('../../modals/OldFormatModal'))
const AOPauseModal = lazy(() => import('../../modals/AOPauseModal'))
const CcyInfoModal = lazy(() => import('../../modals/CcyInfoModal'))
const ClosePositionModal = lazy(() => import('../../modals/ClosePositionModal'))
const ConfirmDMSModal = lazy(() => import('../../modals/ConfirmDMSModal'))
const EditOrderModal = lazy(() => import('../../modals/EditOrderModal'))

const ipcHelpers = window.electronService

const HFUI = (props) => {
  const {
    authToken,
    getSettings,
    getCoreSettings,
    notificationsVisible,
    getFavoritePairs,
    currentMode,
    GAPageview,
    onUnload,
    subscribeAllTickers,
    shouldShowAOPauseModalState,
    settingsShowAlgoPauseInfo,
    settingsTheme,
    isBfxConnected,
  } = props
  useInjectBfxData()

  const unloadHandler = useCallback(() => {
    if (authToken !== null) {
      onUnload(authToken, currentMode)
    }
  }, [authToken, currentMode, onUnload])

  const onElectronAppClose = useCallback(() => {
    if (!authToken || !settingsShowAlgoPauseInfo) {
      closeElectronApp()
    } else {
      shouldShowAOPauseModalState()
    }
  }, [authToken, settingsShowAlgoPauseInfo, shouldShowAOPauseModalState])

  useEffect(() => {
    if (isElectronApp) {
      window.removeEventListener('beforeunload', unloadHandler)
      window.addEventListener('beforeunload', unloadHandler)
      return () => {
        window.removeEventListener('beforeunload', unloadHandler)
      }
    }
  }, [authToken, currentMode, unloadHandler])

  useEffect(() => {
    // if running in the electron environment
    if (ipcHelpers && isElectronApp) {
      ipcHelpers.addAppCloseEventListener(onElectronAppClose)

      return () => {
        ipcHelpers.removeAppCloseEventListener(onElectronAppClose)
      }
    }
  }, [authToken, onElectronAppClose, settingsShowAlgoPauseInfo])

  useEffect(() => {
    const { body } = document
    const lsTheme = localStorage.getItem(SETTINGS.THEME)

    if (authToken && lsTheme !== settingsTheme) {
      localStorage.setItem(SETTINGS.THEME, settingsTheme)
    }

    body.classList.remove(THEMES.DARK)
    body.classList.remove(THEMES.LIGHT)
    body.classList.add(settingsTheme)
  }, [settingsTheme, authToken])

  const location = useLocation()
  const { pathname } = location
  useEffect(() => {
    GAPageview(pathname)
  }, [GAPageview, pathname])

  useEffect(() => {
    if (authToken) {
      getSettings(authToken)
      getFavoritePairs(authToken, currentMode)
      subscribeAllTickers()
    }
  }, [authToken, currentMode, getCoreSettings, getFavoritePairs, getSettings, subscribeAllTickers])

  // fetch core-settings after bitfinex client is connected
  useEffect(() => {
    if (isBfxConnected) {
      getCoreSettings(authToken)
    }
  }, [authToken, getCoreSettings, isBfxConnected])

  return (
    <Suspense fallback={<></>}>
      {authToken ? (
        <>
          <Switch>
            <Redirect from='/index.html' to='/' exact />
            <Route path={Routes.tradingTerminal.path} render={() => <TradingPage />} exact />
            {isElectronApp && Routes.strategyEditor && <Route path={Routes.strategyEditor.path} render={() => <StrategyEditorPage />} />}
            <Route path={Routes.marketData.path} render={() => <MarketDataPage />} />
          </Switch>
          {isElectronApp && (
            <>
              <TradingModeModal />
              <OldFormatModal />
              <ConfirmDMSModal />
              <AOPauseModal />
            </>
          )}
          <BadConnectionModal />
          <CcyInfoModal />
          <EditOrderModal />
          <ClosePositionModal />
        </>
      ) : (
        <>
          {isElectronApp && (
            <AuthenticationPage />
          )}
        </>
      )}
      <NotificationsSidebar notificationsVisible={notificationsVisible} />
      {isElectronApp && <AppUpdate />}
    </Suspense>
  )
}

HFUI.propTypes = {
  authToken: PropTypes.string,
  currentMode: PropTypes.string.isRequired,
  getSettings: PropTypes.func.isRequired,
  getCoreSettings: PropTypes.func.isRequired,
  getFavoritePairs: PropTypes.func.isRequired,
  onUnload: PropTypes.func.isRequired,
  notificationsVisible: PropTypes.bool.isRequired,
  GAPageview: PropTypes.func.isRequired,
  subscribeAllTickers: PropTypes.func.isRequired,
  shouldShowAOPauseModalState: PropTypes.func.isRequired,
  settingsShowAlgoPauseInfo: PropTypes.bool,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
  isBfxConnected: PropTypes.bool,
}

HFUI.defaultProps = {
  authToken: '',
  settingsShowAlgoPauseInfo: true,
  settingsTheme: THEMES.DARK,
  isBfxConnected: false,
}

export default HFUI
