import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router'
import _size from 'lodash/size'
import _some from 'lodash/some'
import _values from 'lodash/values'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'

import { saveAsJSON, readJSONFile } from '../../util/ui'
import { MAX_STRATEGY_LABEL_LENGTH } from '../../constants/variables'
import StrategyEditorPanel from './components/StrategyEditorPanel'
import CreateNewStrategyModal from '../../modals/Strategy/CreateNewStrategyModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import OpenExistingStrategyModal from '../../modals/Strategy/OpenExistingStrategyModal'
import EmptyContent from './components/StrategyEditorEmpty'
import StrategyTab from './tabs/StrategyTab/StrategyTabWrapper'
import BacktestTab from './tabs/BacktestTab'
import IDETab from './tabs/IDETab'
import CreateNewStrategyFromModalOpen from '../../modals/Strategy/CreateNewStrategyFromModal'
import SaveStrategyAsModal from '../../modals/Strategy/SaveStrategyAsModal/SaveStrategyAsModal'
import CancelProcessModal from '../../modals/Strategy/CancelProcessModal'
import StrategyTabTitle from './tabs/StrategyTab/StrategyTab.Title'
import BacktestTabTitle from './tabs/BacktestTab.Title'
import IDETabTitle from './tabs/IDETab.Title'
import ExecutionOptionsModal from '../../modals/Strategy/ExecutionOptionsModal'
import {
  getDefaultStrategyOptions,
  prepareStrategyExecutionArgs,
} from './StrategyEditor.helpers'
import LaunchStrategyModal from '../../modals/Strategy/LaunchStrategyModal'
import routes from '../../constants/routes'

import './style.css'
import { getCurrentModeAPIKeyState } from '../../redux/selectors/ws'
import {
  changeAppSettingsModalState,
  recvNotification,
  setSettingsTab,
} from '../../redux/actions/ui'
import { SETTINGS_TABS } from '../../modals/AppSettingsModal/AppSettingsModal.constants'
import {
  MAIN_MODE,
  PAPER_MODE,
  ALLOWED_PAPER_PAIRS,
} from '../../redux/reducers/ui'

const debug = Debug('hfui-ui:c:strategy-editor')

const EXECUTION_TYPES = Object.freeze({
  LIVE: 'LIVE',
  BACKTEST: 'BACKTEST',
})

const StrategyEditor = (props) => {
  const {
    moveable,
    removeable,
    onRemove,
    authToken,
    gaCreateStrategy,
    strategyContent,
    backtestResults,
    strategyDirty,
    setStrategyDirty,
    setStrategy,
    strategy,
    onLoadStrategy,
    dsExecuteLiveStrategy,
    dsStopLiveStrategy,
    markets,
    saveStrategy,
    isPaperTrading,
    dsExecuteBacktest,
    showError,
    flags,
    isBetaVersion,
    allExecutionResults,
    executing,
    sectionErrors,
    liveResults,
    runningStrategiesMapping,
    savedStrategies,
  } = props
  const { t } = useTranslation()
  const location = useLocation()
  const history = useHistory()

  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [createNewStrategyModalOpen, setCreateNewStrategyModalOpen] = useState(false)
  const [createNewStrategyFromModalOpen, setCreateNewStrategyFromModalOpen] = useState(false)
  const [openExistingStrategyModalOpen, setOpenExistingStrategyModalOpen] = useState(false)
  const [isSaveStrategyAsModalOpen, setIsSaveStrategyModalOpen] = useState(false)
  const [isCancelProcessModalOpen, setIsCancelProcessModalOpen] = useState(false)
  const [isExecutionOptionsModalOpen, setIsExecutionOptionsModalOpen] = useState(false)
  const [isLaunchStrategyModalOpen, setIsLaunchStrategyModalOpen] = useState(false)
  const [executionOptionsModalType, setExecutionOptionsModalType] = useState(
    EXECUTION_TYPES.LIVE,
  )

  const strategyOptions = _get(
    strategy,
    'strategyOptions',
    getDefaultStrategyOptions(markets),
  )

  const {
    symbol,
    timeframe,
    trades,
    candles,
    startDate,
    endDate,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
  } = strategyOptions

  const isFullFilled = !!capitalAllocation && !!stopLossPerc && !!maxDrawdownPerc
  const strategyId = strategy?.id

  const runningStrategyID = runningStrategiesMapping[strategyId]
  const currentStrategyResults = liveResults?.[runningStrategyID] || {}
  const constraints = {
    allocation: Number(capitalAllocation),
    percStopLoss: Number(stopLossPerc),
    maxDrawdown: Number(maxDrawdownPerc),
  }

  const execResults = {
    ...allExecutionResults,
    executing,
    results: currentStrategyResults,
  }

  const onCloseModals = () => {
    setOpenExistingStrategyModalOpen(false)
    setCreateNewStrategyModalOpen(false)
    setIsRemoveModalOpened(false)
    setCreateNewStrategyFromModalOpen(false)
    setIsSaveStrategyModalOpen(false)
    setIsExecutionOptionsModalOpen(false)
    setIsCancelProcessModalOpen(false)
    setIsLaunchStrategyModalOpen(false)
  }

  const onCreateNewStrategy = (label, content = {}) => {
    const newStrategy = {
      ...content,
      label,
      id: v4(),
      strategyOptions: getDefaultStrategyOptions(markets),
    }
    saveStrategy(newStrategy)
    onLoadStrategy(newStrategy)

    onCloseModals()
  }

  const onRemoveStrategy = () => {
    const { id = strategyId } = strategy
    onCloseModals()
    onRemove(authToken, id)
    onLoadStrategy({}, true)
  }

  const onExportStrategy = () => {
    const { label } = strategyContent
    saveAsJSON(strategyContent, label)
  }

  const onImportStrategy = async () => {
    try {
      const newStrategy = await readJSONFile()
      if (
        'label' in newStrategy
        && _size(newStrategy.label) < MAX_STRATEGY_LABEL_LENGTH
      ) {
        delete newStrategy.id
        onCreateNewStrategy(newStrategy.label, newStrategy)
      }
    } catch (e) {
      debug('Error while importing strategy: %s', e)
    }
  }

  const onSaveStrategy = useCallback(() => {
    saveStrategy(strategy)
    setStrategyDirty(false)
  }, [saveStrategy, setStrategyDirty, strategy])

  const onSaveAsStrategy = (newStrategy) => {
    setStrategy(newStrategy)
    saveStrategy(newStrategy)
    setStrategyDirty(false)
  }

  const cancelProcess = () => {

  }

  const onCancelProcess = () => {
    setIsCancelProcessModalOpen(true)
  }

  const saveStrategyOptions = (newOptions) => {
    onSaveAsStrategy({
      ...strategy,
      strategyOptions: { ...strategyOptions, ...newOptions },
    })
  }

  const onBacktestStart = () => {
    const startNum = new Date(startDate).getTime()
    const endNum = new Date(endDate).getTime()

    if (!trades && !candles) {
      showError(t('strategyEditor.checkboxWarningMessage'))
      return
    }

    if (!timeframe) {
      showError(t('strategyEditor.invalidTF'))
      return
    }

    if (endNum <= startNum) {
      showError(t('strategyEditor.invalidPeriod'))
      return
    }

    if (!isFullFilled) {
      setIsExecutionOptionsModalOpen(true)
      setExecutionOptionsModalType(EXECUTION_TYPES.BACKTEST)
      return
    }

    dsExecuteBacktest(
      startNum,
      endNum,
      symbol?.wsID,
      timeframe,
      candles,
      trades,
      strategy,
      constraints,
    )
  }

  const apiCredentials = useSelector(getCurrentModeAPIKeyState)
  const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid
  const dispatch = useDispatch()
  const openAppSettingsModal = () => dispatch(changeAppSettingsModalState(true))
  const setAPIKeysTab = () => dispatch(
    setSettingsTab(
      SETTINGS_TABS.Keys,
      _includes(ALLOWED_PAPER_PAIRS, symbol?.wsID) ? PAPER_MODE : MAIN_MODE,
    ),
  )
  const showAPIKeyError = () => dispatch(
    recvNotification({
      mts: Date.now(),
      status: 'error',
      text: t('notifications.strategyLaunchMissingAPIKey'),
      cid: v4(),
    }),
  )

  const checkForAPIKeys = () => {
    if (!apiClientConfigured) {
      showAPIKeyError()
      setTimeout(() => {
        setAPIKeysTab()
        openAppSettingsModal()
      }, 250)

      return false
    }

    return true
  }

  const onLaunchExecutionClick = () => setIsLaunchStrategyModalOpen(true)

  const saveStrategyAndStartExecution = () => {
    if (!checkForAPIKeys()) {
      return
    }
    if (!isFullFilled) {
      setIsExecutionOptionsModalOpen(true)
      setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
      return
    }
    onSaveStrategy()

    const executionArgs = prepareStrategyExecutionArgs(strategy)
    dsExecuteLiveStrategy({
      authToken,
      ...executionArgs,
    })
  }

  const loadStrategyAndStartExecution = (strategyToLoad) => {
    if (!checkForAPIKeys()) {
      return
    }
    onLoadStrategy(strategyToLoad)
    setTimeout(() => {
      const executionArgs = prepareStrategyExecutionArgs(strategyToLoad)
      dsExecuteLiveStrategy({
        authToken,
        ...executionArgs,
      })
      history.push(routes.strategyEditor.path)
    }, 500)
  }

  const stopExecution = () => {
    dsStopLiveStrategy(authToken, runningStrategyID)
  }

  const hasErrorsInIDE = useMemo(
    () => _some(_values(sectionErrors), (e) => !!e),
    [sectionErrors],
  )

  const openCreateNewStrategyModal = () => {
    setCreateNewStrategyModalOpen(true)
  }

  const openCreateNewStrategyFromModal = () => {
    setCreateNewStrategyFromModalOpen(true)
  }

  const openRemoveModal = () => {
    setIsRemoveModalOpened(true)
  }

  const openSaveStrategyAsModal = () => {
    setIsSaveStrategyModalOpen(true)
  }

  const openExecutionOptionsModal = () => {
    if (!checkForAPIKeys()) {
      return
    }

    setIsExecutionOptionsModalOpen(true)
    setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
  }

  useEffect(() => {
    const { search } = location
    if (executing || !search || _isEmpty(savedStrategies)) {
      return
    }
    const { execute } = queryString.parse(location.search)
    if (!execute) {
      return
    }

    const strategyToLoad = savedStrategies[execute]

    if (_isEmpty(strategyToLoad)) {
      return
    }
    loadStrategyAndStartExecution(strategyToLoad)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedStrategies, executing, location])

  return (
    <>
      {!strategy || _isEmpty(strategy) ? (
        <EmptyContent
          openCreateNewStrategyModal={openCreateNewStrategyModal}
          openCreateNewStrategyFromModal={openCreateNewStrategyFromModal}
          isPaperTrading={isPaperTrading}
        />
      ) : (
        <>
          <StrategyEditorPanel
            moveable={moveable}
            removeable={removeable}
            onRemoveStrategy={onRemoveStrategy}
          >
            {(isBetaVersion || flags?.live_execution) && (
              <StrategyTab
                htmlKey='strategy'
                sbtitle={({ selectedTab, sidebarOpened }) => (
                  <StrategyTabTitle
                    startExecution={onLaunchExecutionClick}
                    stopExecution={stopExecution}
                    onLoadStrategy={onLoadStrategy}
                    onExportStrategy={onExportStrategy}
                    onSaveStrategy={onSaveStrategy}
                    onOpenRemoveModal={openRemoveModal}
                    onOpenCreateStrategyModal={openCreateNewStrategyModal}
                    onOpenCreateStrategyFromModal={
                      openCreateNewStrategyFromModal
                    }
                    onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
                    onImportStrategy={onImportStrategy}
                    strategy={strategy}
                    strategyId={strategyId}
                    executionResults={execResults}
                    selectedTab={selectedTab}
                    sidebarOpened={sidebarOpened}
                    strategyDirty={strategyDirty}
                  />
                )}
                onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
                isPaperTrading={isPaperTrading}
                startExecution={onLaunchExecutionClick}
                stopExecution={stopExecution}
                executionResults={execResults}
                onSaveAsStrategy={onSaveAsStrategy}
                onSaveStrategy={onSaveStrategy}
                openExecutionOptionsModal={openExecutionOptionsModal}
                saveStrategyOptions={saveStrategyOptions}
                hasErrors={hasErrorsInIDE}
                onCancelProcess={onCancelProcess}
                {...props}
                strategy={{
                  ...strategy,
                  strategyOptions,
                }}
              />
            )}

            {isPaperTrading && (isBetaVersion || flags?.backtest) && (
              <BacktestTab
                htmlKey='backtest'
                sbtitle={({ sidebarOpened }) => (
                  <BacktestTabTitle
                    results={backtestResults}
                    sidebarOpened={sidebarOpened}
                  />
                )}
                results={backtestResults}
                onBacktestStart={onBacktestStart}
                saveStrategyOptions={saveStrategyOptions}
                {...props}
                strategy={{
                  ...strategy,
                  strategyOptions,
                }}
              />
            )}
            {(isBetaVersion || flags?.docs) && !isPaperTrading && (
              <IDETab
                htmlKey='view_in_ide'
                key='view_in_ide'
                hasErrors={hasErrorsInIDE}
                onSaveStrategy={onSaveStrategy}
                onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
                sbtitle={({ sidebarOpened }) => (
                  <IDETabTitle
                    hasErrors={hasErrorsInIDE}
                    strategyDirty={strategyDirty}
                    sidebarOpened={sidebarOpened}
                  />
                )}
                {...props}
              />
            )}
          </StrategyEditorPanel>
          <RemoveExistingStrategyModal
            isOpen={isRemoveModalOpened}
            onClose={onCloseModals}
            onRemoveStrategy={onRemoveStrategy}
            strategy={strategy}
          />
          <SaveStrategyAsModal
            isOpen={isSaveStrategyAsModalOpen}
            onClose={onCloseModals}
            strategy={strategy}
            onSubmit={onSaveAsStrategy}
          />
          <ExecutionOptionsModal
            isOpen={isExecutionOptionsModalOpen}
            onClose={onCloseModals}
            saveStrategyOptions={saveStrategyOptions}
            capitalAllocation={capitalAllocation}
            stopLossPerc={stopLossPerc}
            maxDrawdownPerc={maxDrawdownPerc}
            startExecution={
              executionOptionsModalType === EXECUTION_TYPES.LIVE
                ? onLaunchExecutionClick
                : onBacktestStart
            }
          />
          <LaunchStrategyModal
            onSubmit={saveStrategyAndStartExecution}
            isOpen={isLaunchStrategyModalOpen}
            onClose={onCloseModals}
            strategyId={strategyId}
          />
        </>
      )}
      <CreateNewStrategyFromModalOpen
        isOpen={createNewStrategyFromModalOpen}
        gaCreateStrategy={gaCreateStrategy}
        onClose={onCloseModals}
        onSubmit={onCreateNewStrategy}
      />
      <CreateNewStrategyModal
        isOpen={createNewStrategyModalOpen}
        gaCreateStrategy={gaCreateStrategy}
        onClose={onCloseModals}
        onSubmit={onCreateNewStrategy}
        onImportStrategy={onImportStrategy}
      />
      <OpenExistingStrategyModal
        isOpen={openExistingStrategyModalOpen}
        onClose={onCloseModals}
        onOpen={onLoadStrategy}
      />
      <CancelProcessModal
        isOpen={isCancelProcessModalOpen}
        onClose={onCloseModals}
        onSubmit={cancelProcess}
      />
    </>
  )
}

StrategyEditor.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
  markets: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
  setStrategy: PropTypes.func,
  backtestResults: PropTypes.objectOf(PropTypes.any).isRequired, // eslint-disable-line
  strategy: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    strategyOptions: PropTypes.object,
  }),
  dsStopLiveStrategy: PropTypes.func.isRequired,
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  indicators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ), // eslint-disable-line
  strategyDirty: PropTypes.bool.isRequired,
  setStrategyDirty: PropTypes.func.isRequired,
  gaCreateStrategy: PropTypes.func.isRequired,
  allExecutionResults: PropTypes.shape({
    executing: PropTypes.bool,
    loading: PropTypes.bool,
  }).isRequired,
  strategyContent: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number,
      PropTypes.oneOf([null]).isRequired,
      PropTypes.object,
    ]),
  ),
  savedStrategies: PropTypes.objectOf(PropTypes.object), // eslint-disable-line
  saveStrategy: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  dsExecuteBacktest: PropTypes.func.isRequired,
  isBetaVersion: PropTypes.bool.isRequired,
  flags: PropTypes.shape({
    docs: PropTypes.bool,
    live_execution: PropTypes.bool,
    backtest: PropTypes.bool,
  }).isRequired,
  showError: PropTypes.func.isRequired,
  liveResults: PropTypes.objectOf(PropTypes.object), // eslint-disable-line
  runningStrategiesMapping: PropTypes.objectOf(PropTypes.string),
  sectionErrors: PropTypes.objectOf(PropTypes.string).isRequired,
  executing: PropTypes.bool.isRequired,
}

StrategyEditor.defaultProps = {
  moveable: false,
  removeable: false,
  strategyContent: {},
  setStrategy: () => {},
  strategy: {
    id: null,
    label: null,
  },
  indicators: [],
  liveResults: {},
  runningStrategiesMapping: {},
}

export default memo(StrategyEditor)
