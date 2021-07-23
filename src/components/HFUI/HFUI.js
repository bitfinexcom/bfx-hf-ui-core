/* eslint-disable consistent-return */
import React, { useEffect, Suspense, lazy } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'

import StrategyEditorPage from '../../pages/StrategyEditor'
import NotificationsSidebar from '../NotificationsSidebar'
import closeElectronApp from '../../redux/helpers/close_electron_app'
import Routes from '../../constants/routes'
import { isElectronApp } from '../../redux/config'
import MIN_SAFE_WIDTH from '../../constants/MIN_SAFE_WIDTH'
import BestExperienceMessageModal from '../BestExperienceMessageModal'

import './style.css'

// const StrategyEditorPage = lazy(() => import('../../pages/StrategyEditor'))
const TradingPage = lazy(() => import('../../pages/Trading'))
const MarketDataPage = lazy(() => import('../../pages/MarketData'))
const AuthenticationPage = lazy(() => import('../../pages/Authentication'))

const TradingModeModal = lazy(() => import('../TradingModeModal'))
const BadConnectionModal = lazy(() => import('../BadConnectionModal'))
const OldFormatModal = lazy(() => import('../OldFormatModal'))
const AOPauseModal = lazy(() => import('../AOPauseModal'))
const HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL = 'HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL'

const HFUI = ({
  authToken, getSettings, notificationsVisible, getFavoritePairs, currentMode, GAPageview,
  currentPage, onUnload, subscribeAllTickers, shouldShowAOPauseModalState, settingsShowAlgoPauseInfo,
}) => {
  const [isBestExperienceMessageModalOpen, setBestExperienceModalState] = useState(false)

  const unloadHandler = () => {
    if (authToken !== null) {
      onUnload(authToken, currentMode)
    }
  }

  const onElectronAppClose = () => {
    if (!authToken || !settingsShowAlgoPauseInfo) {
      closeElectronApp()
    } else {
      shouldShowAOPauseModalState()
    }
  }
  const closeBestExperienceModal = () => setBestExperienceModalState(false)

  const onSubmitBestExperienceModal = () => {
    localStorage.setItem(HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL, JSON.stringify(false))
    closeBestExperienceModal()
  }

  useEffect(() => {
    const currentWidth = document.documentElement.clientWidth
    let needToShowModal = localStorage.getItem(HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL)
    if (needToShowModal === null || needToShowModal === undefined) {
      needToShowModal = true
    } else {
      needToShowModal = JSON.parse(needToShowModal)
    }
    if (isElectronApp || !needToShowModal || currentWidth >= MIN_SAFE_WIDTH) {
      return
    }
    setBestExperienceModalState(true)
  }, [])

  useEffect(() => {
    window.removeEventListener('beforeunload', unloadHandler)
    window.addEventListener('beforeunload', unloadHandler)
    return () => {
      window.removeEventListener('beforeunload', unloadHandler)
    }
  }, [authToken, currentMode])

  useEffect(() => {
    // if running in the electron environment
    if (_isFunction(window.require)) {
      const electron = window.require('electron')
      const { ipcRenderer } = electron
      ipcRenderer.on('app-close', onElectronAppClose)

      return () => {
        ipcRenderer.removeListener('app-close', onElectronAppClose)
      }
    }
  }, [authToken, settingsShowAlgoPauseInfo])

  useEffect(() => {
    GAPageview(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (authToken) {
      getSettings(authToken)
      getFavoritePairs(authToken, currentMode)
      subscribeAllTickers()
    }
  }, [authToken])

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
          {isElectronApp ? (
            <>
              <TradingModeModal />
              <BadConnectionModal />
              <OldFormatModal />
              <AOPauseModal />
            </>
          ) : (
            <BestExperienceMessageModal
              isOpen={isBestExperienceMessageModalOpen}
              onClose={closeBestExperienceModal}
              onSubmit={onSubmitBestExperienceModal}
            />
          )}
        </>
      ) : (
        <AuthenticationPage />
      )}
      <NotificationsSidebar notificationsVisible={notificationsVisible} />
    </Suspense>
  )
}

HFUI.propTypes = {
  authToken: PropTypes.string,
  currentPage: PropTypes.string,
  currentMode: PropTypes.string.isRequired,
  getSettings: PropTypes.func.isRequired,
  getFavoritePairs: PropTypes.func.isRequired,
  onUnload: PropTypes.func.isRequired,
  notificationsVisible: PropTypes.bool.isRequired,
  GAPageview: PropTypes.func.isRequired,
  subscribeAllTickers: PropTypes.func.isRequired,
  shouldShowAOPauseModalState: PropTypes.func.isRequired,
  settingsShowAlgoPauseInfo: PropTypes.bool,
}

HFUI.defaultProps = {
  authToken: '',
  currentPage: '',
  settingsShowAlgoPauseInfo: true,
}

export default HFUI
