/* eslint-disable consistent-return */
import React, {
  useEffect, Suspense, lazy, useCallback,
} from 'react'
import {
  Route, Switch, Redirect, useLocation,
} from 'react-router'
import PropTypes from 'prop-types'

import { THEMES, SETTINGS_KEYS } from '../../redux/selectors/ui'
import useInjectBfxData from '../../hooks/useInjectBfxData'
import NotificationsSidebar from '../NotificationsSidebar'
import AppUpdate from '../AppUpdate'
import closeElectronApp from '../../redux/helpers/close_electron_app'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import ModalsWrapper from '../../modals/ModalsWrapper/ModalsWrapper'

import './style.css'

// const StrategyEditorPage = lazy(() => import('../../pages/StrategyEditor'))
const TradingPage = lazy(() => import('../../pages/Trading'))
const MarketDataPage = lazy(() => import('../../pages/MarketData'))
const AuthenticationPage = lazy(() => import('../../pages/Authentication'))
const StrategiesPage = lazy(() => import('../../pages/Strategies'))

const ipcHelpers = window.electronService

const HFUI = (props) => {
  const {
    authToken,
    getSettings,
    getCoreSettings,
    getFeatureFlags,
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
    showStrategies,
    getPastStrategies,
    openAppSettingsModal,
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
      ipcHelpers.addOpenSettingsModalListener(openAppSettingsModal)

      return () => {
        ipcHelpers.removeAppCloseEventListener(onElectronAppClose)
        ipcHelpers.removeOpenSettingsModalListener(openAppSettingsModal)
      }
    }
  }, [
    authToken,
    onElectronAppClose,
    openAppSettingsModal,
    settingsShowAlgoPauseInfo,
  ])

  useEffect(() => {
    const { body } = document
    const lsTheme = localStorage.getItem(SETTINGS_KEYS.THEME)

    if (authToken && lsTheme !== settingsTheme) {
      localStorage.setItem(SETTINGS_KEYS.THEME, settingsTheme)
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

  // fetch after successful log in
  useEffect(() => {
    if (authToken) {
      getSettings(authToken)
      getFeatureFlags(authToken)
    }
  }, [authToken, getSettings, getFeatureFlags])

  // fetch on every mode change
  useEffect(() => {
    if (authToken) {
      getFavoritePairs(authToken, currentMode)
      getPastStrategies(authToken)
    }
  }, [authToken, currentMode, getFavoritePairs, getPastStrategies])

  // subscribe to tickers
  useEffect(() => {
    subscribeAllTickers()
  }, [subscribeAllTickers])

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
            <Route
              path={Routes.tradingTerminal.path}
              render={() => <TradingPage />}
              exact
            />
            {showStrategies && Routes.strategyEditor && (
              <Route
                path={Routes.strategyEditor.path}
                render={() => <StrategiesPage />}
              />
            )}
            <Route
              path={Routes.marketData.path}
              render={() => <MarketDataPage />}
            />
          </Switch>
          <ModalsWrapper isElectronApp={isElectronApp} />
        </>
      ) : (
        <>{isElectronApp && <AuthenticationPage />}</>
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
  getFeatureFlags: PropTypes.func.isRequired,
  getCoreSettings: PropTypes.func.isRequired,
  getFavoritePairs: PropTypes.func.isRequired,
  getPastStrategies: PropTypes.func.isRequired,
  onUnload: PropTypes.func.isRequired,
  notificationsVisible: PropTypes.bool.isRequired,
  GAPageview: PropTypes.func.isRequired,
  subscribeAllTickers: PropTypes.func.isRequired,
  shouldShowAOPauseModalState: PropTypes.func.isRequired,
  settingsShowAlgoPauseInfo: PropTypes.bool,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
  isBfxConnected: PropTypes.bool,
  showStrategies: PropTypes.bool,
  openAppSettingsModal: PropTypes.func.isRequired,
}

HFUI.defaultProps = {
  authToken: '',
  settingsShowAlgoPauseInfo: true,
  settingsTheme: THEMES.DARK,
  isBfxConnected: false,
  showStrategies: false,
}

export default HFUI
