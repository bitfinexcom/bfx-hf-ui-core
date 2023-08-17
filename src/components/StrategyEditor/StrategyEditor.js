/* eslint-disable react/no-unknown-property */
import React, {
  memo, useEffect, useMemo, useState, useCallback,
} from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _some from 'lodash/some'
import _values from 'lodash/values'
import _get from 'lodash/get'
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
import StrategySettingsModal from '../../modals/Strategy/StrategySettingsModal'
import SaveUnsavedChangesLaunchModal from '../../modals/Strategy/SaveUnsavedChangesLaunchModal'
import {
  getDefaultStrategyOptions,
  isExecutionInputsFullFilled,
  prepareStrategyBacktestingArgs,
  prepareStrategyExecutionArgs,
  EXECUTION_TYPES,
} from './StrategyEditor.helpers'
import LaunchStrategyModal from '../../modals/Strategy/LaunchStrategyModal'
import { getAPIKeyStates } from '../../redux/selectors/ws'
import {
  changeUIModalState,
  recvNotification,
  setSettingsTab,
} from '../../redux/actions/ui'
import { SETTINGS_TABS } from '../../modals/AppSettingsModal/AppSettingsModal.constants'

import { getStrategyModeForSymbol } from '../../util/market'
import useToggle from '../../hooks/useToggle'
import {
  INDICATORS_ARRAY_SHAPE,
  STRATEGY_SHAPE,
} from '../../constants/prop-types-shapes'
import EditStrategyLabelModal from '../../modals/Strategy/EditStrategyLabelModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { PAPER_MODE } from '../../redux/reducers/ui'
import SettingsTitle from './tabs/SettingsTitle'
import { LANGUAGES } from '../../locales/i18n'
import { LOG_LEVELS } from '../../constants/logging'

import './style.css'

const debug = Debug('hfui-ui:c:strategy-editor')

const StrategyEditor = (props) => {
  const {
    moveable,
    removeable,
    onRemove,
    authToken,
    gaCreateStrategy,
    backtestState,
    strategyDirty,
    setStrategyDirty,
    setStrategy,
    strategy,
    onLoadStrategy,
    dsExecuteLiveStrategy,
    dsStopLiveStrategy,
    saveStrategy,
    isPaperTrading,
    dsExecuteBacktest,
    showError,
    flags,
    isBetaVersion,
    executionState,
    sectionErrors,
    savedStrategies,
    cancelProcess,
    changeTradingMode,
    saveStrategyToExecuteToLS,
    removeStrategyToExecuteFromLS,
    pendingLiveStrategy,
    onDefineIndicatorsChange,
    evalSectionContent,
    setSectionErrors,
    serviceStatus,
    logInformation,
  } = props
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const [isRemoveModalOpen, , openRemoveModal, closeRemoveModal] = useToggle(false)
  const [
    createNewStrategyModalOpen,,
    openCreateNewStrategyModal,
    closeCreateNewStrategyModal,
  ] = useToggle(false)
  const [
    createNewStrategyFromModalOpened,,
    openCreateNewStrategyFromModal,
    closeCreateNewStrategyFromModal,
  ] = useToggle(false)
  const [isOpenExistingStrategyModalOpen, , , closeOpenExistingStrategyModal] = useToggle(false)
  const [
    isSaveStrategyAsModalOpen,,
    openSaveStrategyAsModal,
    closeSaveStrategyAsModal,
  ] = useToggle(false)
  const [
    isEditStrategyLabelModalOpen,,
    openEditStrategyLabelModal,
    closeEditStrategyLabelModal,
  ] = useToggle(false)
  const [
    isSaveStrategyBeforeLaunchModalOpen,,
    openSaveStrategyBeforeLaunchModal,
    closeSaveStrategyBeforeLaunchModal,
  ] = useToggle(false)
  const [
    isCancelProcessModalOpen,,
    openCancelProcessModal,
    closeCancelProcessModal,
  ] = useToggle(false)
  const [
    isStrategySettingsModalOpen,,
    openStrategySettingsModal,
    closeStrategySettingsModal,
  ] = useToggle(false)
  const [
    isLaunchStrategyModalOpen,,
    openLaunchStrategyModal,
    closeLaunchStrategyModal,
  ] = useToggle(false)
  const [strategySettingsModalType, setStrategySettingsModalType] = useState(null)

  const strategyOptions = _get(
    strategy,
    'strategyOptions',
    getDefaultStrategyOptions(),
  )

  const isWideSidebar = useMemo(() => {
    return language === LANGUAGES.es || language === LANGUAGES.pt
  }, [language])

  const {
    symbol,
    timeframe,
    trades,
    candles,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
  } = strategyOptions

  const { loadingGid } = executionState
  const { strategyManager: isStrategyManagerRunning } = serviceStatus

  const isFullFilled = isExecutionInputsFullFilled(
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
  )

  const strategyId = strategy?.id
  const strategyLabel = strategy?.label
  const executionId = strategy?.executionId

  const onCloseModals = useCallback(() => {
    closeOpenExistingStrategyModal()
    closeCreateNewStrategyModal()
    closeRemoveModal()
    closeCreateNewStrategyFromModal()
    closeSaveStrategyAsModal()
    closeStrategySettingsModal()
    closeCancelProcessModal()
    closeLaunchStrategyModal()
    closeSaveStrategyBeforeLaunchModal()
    closeEditStrategyLabelModal()
  }, [
    closeCancelProcessModal,
    closeCreateNewStrategyFromModal,
    closeCreateNewStrategyModal,
    closeStrategySettingsModal,
    closeLaunchStrategyModal,
    closeOpenExistingStrategyModal,
    closeRemoveModal,
    closeSaveStrategyAsModal,
    closeSaveStrategyBeforeLaunchModal,
    closeEditStrategyLabelModal,
  ])

  const onCreateNewStrategy = useCallback(
    (label, content = {}) => {
      gaCreateStrategy()

      const newStrategyContent = { ...content }

      const newStrategy = {
        label,
        id: v4(),
        strategyOptions: getDefaultStrategyOptions(),
        strategyContent: newStrategyContent,
      }
      saveStrategy(newStrategy)
      onLoadStrategy(newStrategy)

      onCloseModals()
    },
    [gaCreateStrategy, onCloseModals, onLoadStrategy, saveStrategy],
  )

  const onCreateStrategyFromExisted = useCallback(
    (label, _newStrategy, forcedLoad = false) => {
      gaCreateStrategy()

      const newStrategy = {
        ..._newStrategy,
        label,
        id: v4(),
      }

      // Need to delete inherited execution data of parent strategy
      delete newStrategy.executionId
      newStrategy.results = {}
      delete newStrategy.startedOn
      delete newStrategy.stoppedOn

      saveStrategy(newStrategy)
      onLoadStrategy(newStrategy, forcedLoad)

      onCloseModals()
    },
    [gaCreateStrategy, onCloseModals, onLoadStrategy, saveStrategy],
  )

  const onRemoveStrategy = useCallback(() => {
    onCloseModals()
    onRemove(authToken, strategyId)
    onLoadStrategy({}, true)
  }, [authToken, strategyId, onCloseModals, onLoadStrategy, onRemove])

  const onExportStrategy = useCallback(() => {
    saveAsJSON(strategy, strategyLabel)
  }, [strategyLabel, strategy])

  const onImportStrategy = useCallback(async () => {
    try {
      const newStrategy = await readJSONFile()
      if (
        'label' in newStrategy
        && _size(newStrategy.label) < MAX_STRATEGY_LABEL_LENGTH
      ) {
        const preparedStrategy = { ...newStrategy }
        if (_isEmpty(preparedStrategy.strategyContent)) {
          preparedStrategy.strategyContent = { ...preparedStrategy }
          delete preparedStrategy.strategyContent.label
          delete preparedStrategy.strategyContent.id
        }
        onCreateStrategyFromExisted(preparedStrategy.label, preparedStrategy)
        logInformation(
          `New strategy draft created (${preparedStrategy.label})`,
          LOG_LEVELS.INFO,
          'strategy_draft_init',
          {
            source: 'json',
            from: preparedStrategy.label,
          },
        )
      }
    } catch (e) {
      debug('Error while importing strategy: %s', e)
    }
  }, [onCreateStrategyFromExisted, logInformation])

  const onSaveStrategy = useCallback(() => {
    if (executionId) {
      const newLabel = t('strategyEditor.copyOfStrategy', {
        strategyName: strategyLabel,
      })
      onCreateStrategyFromExisted(newLabel, strategy, true)
      return
    }

    saveStrategy(strategy)
    setStrategyDirty(false)
  }, [
    executionId,
    onCreateStrategyFromExisted,
    saveStrategy,
    setStrategyDirty,
    strategy,
    strategyLabel,
    t,
  ])

  const onSaveAsStrategy = useCallback(
    (newStrategy) => {
      if (executionId) {
        const newLabel = t('strategyEditor.copyOfStrategy', {
          strategyName: strategyLabel,
        })
        onCreateStrategyFromExisted(newLabel, newStrategy, true)
        return
      }

      setStrategy(newStrategy, PAPER_MODE)
      saveStrategy(newStrategy)
      setStrategyDirty(false)
    },
    [
      executionId,
      onCreateStrategyFromExisted,
      saveStrategy,
      setStrategy,
      setStrategyDirty,
      strategyLabel,
      t,
    ],
  )

  const _cancelProcess = useCallback(() => {
    const { gid } = backtestState

    cancelProcess(authToken, isPaperTrading, gid, loadingGid)
    closeCancelProcessModal()
  }, [
    authToken,
    backtestState,
    cancelProcess,
    closeCancelProcessModal,
    isPaperTrading,
    loadingGid,
  ])

  const onCancelProcess = useCallback(() => {
    if (isPaperTrading) {
      _cancelProcess()
    } else {
      openCancelProcessModal()
    }
  }, [_cancelProcess, isPaperTrading, openCancelProcessModal])

  const saveStrategyOptions = useCallback(
    (newOptions) => {
      const newStrategy = {
        ...strategy,
        strategyOptions: { ...strategyOptions, ...newOptions },
      }
      saveStrategy(newStrategy)
      onLoadStrategy(newStrategy, false)
    },
    [onLoadStrategy, saveStrategy, strategy, strategyOptions],
  )

  const onBacktestStart = useCallback(() => {
    const backtestArgs = prepareStrategyBacktestingArgs(strategy)
    const { endNum, startNum } = backtestArgs

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
      openStrategySettingsModal()
      setStrategySettingsModalType(EXECUTION_TYPES.BACKTEST)
      return
    }
    setStrategySettingsModalType(null)

    dsExecuteBacktest(backtestArgs)
  }, [
    candles,
    dsExecuteBacktest,
    isFullFilled,
    openStrategySettingsModal,
    showError,
    strategy,
    t,
    timeframe,
    trades,
  ])

  const apiKeyStates = useSelector(getAPIKeyStates)
  const dispatch = useDispatch()
  const openAppSettingsModal = useCallback(
    () => dispatch(changeUIModalState(UI_MODAL_KEYS.APP_SETTINGS_MODAL, true)),
    [dispatch],
  )
  const setAPIKeysTab = useCallback(
    () => dispatch(
      setSettingsTab(SETTINGS_TABS.Keys, getStrategyModeForSymbol(symbol)),
    ),
    [dispatch, symbol],
  )
  const showAPIKeyError = useCallback(
    () => dispatch(
      recvNotification({
        mts: Date.now(),
        status: 'error',
        text: t('notifications.strategyLaunchMissingAPIKey'),
        cid: v4(),
      }),
    ),
    [dispatch, t],
  )

  const checkForAPIKeys = useCallback(
    (strategyToRun) => {
      const mode = getStrategyModeForSymbol(
        strategyToRun?.strategyOptions?.symbol,
      )
      const apiKeyState = apiKeyStates?.[mode]
      if (!apiKeyState?.configured || !apiKeyState?.valid) {
        showAPIKeyError()
        setTimeout(() => {
          setAPIKeysTab()
          openAppSettingsModal()
        }, 250)

        return false
      }

      return true
    },
    [apiKeyStates, openAppSettingsModal, setAPIKeysTab, showAPIKeyError],
  )

  const onLaunchExecutionClick = useCallback(
    (forcedLaunch = false) => {
      if (strategyDirty && !forcedLaunch) {
        openSaveStrategyBeforeLaunchModal()
        return
      }
      if (isFullFilled) {
        openLaunchStrategyModal()
        setStrategySettingsModalType(null)
        return
      }

      openStrategySettingsModal()
      setStrategySettingsModalType(EXECUTION_TYPES.LIVE)
    },
    [
      isFullFilled,
      openStrategySettingsModal,
      openLaunchStrategyModal,
      openSaveStrategyBeforeLaunchModal,
      strategyDirty,
    ],
  )

  const launchWithoutSaving = () => {
    onCloseModals()
    onLaunchExecutionClick(true)
  }

  const saveAndLaunch = () => {
    onSaveStrategy()
    onCloseModals()
    onLaunchExecutionClick(true)
  }

  const saveStrategyAndStartExecution = useCallback(() => {
    if (!checkForAPIKeys(strategy)) {
      return
    }

    if (!isFullFilled) {
      openStrategySettingsModal()
      setStrategySettingsModalType(EXECUTION_TYPES.LIVE)
      return
    }
    if (isPaperTrading) {
      changeTradingMode(!isPaperTrading)
      saveStrategyToExecuteToLS(strategy)
      return
    }

    const executionArgs = prepareStrategyExecutionArgs(strategy)
    dsExecuteLiveStrategy({
      authToken,
      ...executionArgs,
    })
  }, [
    authToken,
    changeTradingMode,
    checkForAPIKeys,
    dsExecuteLiveStrategy,
    isFullFilled,
    isPaperTrading,
    openStrategySettingsModal,
    strategy,
    saveStrategyToExecuteToLS,
  ])

  const loadStrategyAndStartExecution = useCallback(
    (strategyToLoad) => {
      if (!checkForAPIKeys(strategyToLoad)) {
        return
      }
      onLoadStrategy(strategyToLoad, true)
      setTimeout(() => {
        const executionArgs = prepareStrategyExecutionArgs(strategyToLoad)
        dsExecuteLiveStrategy({
          authToken,
          ...executionArgs,
        })
        removeStrategyToExecuteFromLS()
      }, 500)
    },
    [
      authToken,
      checkForAPIKeys,
      dsExecuteLiveStrategy,
      onLoadStrategy,
      removeStrategyToExecuteFromLS,
    ],
  )

  const stopExecution = useCallback(() => {
    if (!executionId) {
      return
    }
    dsStopLiveStrategy(authToken, executionId)
  }, [authToken, dsStopLiveStrategy, executionId])

  const editInSandbox = useCallback(() => {
    changeTradingMode(!isPaperTrading)
    setStrategy(strategy, PAPER_MODE)
  }, [changeTradingMode, isPaperTrading, setStrategy, strategy])

  const hasErrorsInIDE = useMemo(
    () => _some(_values(sectionErrors), (e) => !!e),
    [sectionErrors],
  )

  // Start strategy executing after change mode
  useEffect(() => {
    if (
      isPaperTrading
      || !pendingLiveStrategy
      || !isStrategyManagerRunning
      || _isEmpty(savedStrategies)
    ) {
      return
    }

    const strategyToLoad = savedStrategies[pendingLiveStrategy]
    if (_isEmpty(strategyToLoad)) {
      return
    }

    loadStrategyAndStartExecution(strategyToLoad)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedStrategies, pendingLiveStrategy, isStrategyManagerRunning])

  const sbtitleStrategy = useCallback(
    ({ selectedTab, sidebarOpened }) => (
      <StrategyTabTitle
        startExecution={onLaunchExecutionClick}
        stopExecution={stopExecution}
        onLoadStrategy={onLoadStrategy}
        onExportStrategy={onExportStrategy}
        onSaveStrategy={onSaveStrategy}
        onOpenRemoveModal={openRemoveModal}
        onOpenCreateStrategyModal={openCreateNewStrategyModal}
        onOpenCreateStrategyFromModal={openCreateNewStrategyFromModal}
        onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
        onImportStrategy={onImportStrategy}
        strategy={strategy}
        strategyId={strategyId}
        executionId={executionId}
        selectedTab={selectedTab}
        sidebarOpened={sidebarOpened}
        strategyDirty={strategyDirty}
        hasErrors={hasErrorsInIDE}
        editInSandbox={editInSandbox}
        isMarketSelected={!_isEmpty(symbol)}
      />
    ),
    [
      executionId,
      hasErrorsInIDE,
      onExportStrategy,
      onImportStrategy,
      onLaunchExecutionClick,
      onLoadStrategy,
      onSaveStrategy,
      openCreateNewStrategyFromModal,
      openCreateNewStrategyModal,
      openRemoveModal,
      openSaveStrategyAsModal,
      stopExecution,
      strategy,
      strategyDirty,
      strategyId,
      symbol,
      editInSandbox,
    ],
  )

  const sbtitleIDE = useCallback(
    ({ sidebarOpened }) => <IDETabTitle sidebarOpened={sidebarOpened} />,
    [],
  )

  const sbtitleBacktest = useCallback(
    ({ sidebarOpened }) => (
      <BacktestTabTitle
        backtestState={backtestState}
        sidebarOpened={sidebarOpened}
      />
    ),
    [backtestState],
  )

  const sbtitleSettings = useCallback(
    ({ sidebarOpened }) => <SettingsTitle sidebarOpened={sidebarOpened} />,
    [],
  )

  return (
    <>
      {!strategy || _isEmpty(strategy) ? (
        <EmptyContent
          openCreateNewStrategyModal={openCreateNewStrategyModal}
          openCreateNewStrategyFromModal={openCreateNewStrategyFromModal}
          onImportStrategy={onImportStrategy}
          isPaperTrading={isPaperTrading}
        />
      ) : (
        <>
          <StrategyEditorPanel
            moveable={moveable}
            removeable={removeable}
            onRemoveStrategy={onRemoveStrategy}
            isWideSidebar={isWideSidebar}
          >
            {(isBetaVersion || flags?.live_execution) && (
              <StrategyTab
                htmlKey='strategy'
                sbtitle={sbtitleStrategy}
                onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
                onOpenEditStrategyLabelModal={openEditStrategyLabelModal}
                isPaperTrading={isPaperTrading}
                stopExecution={stopExecution}
                onSaveStrategy={onSaveStrategy}
                saveStrategyOptions={saveStrategyOptions}
                hasErrors={hasErrorsInIDE}
                onCancelProcess={onCancelProcess}
                {...props}
              />
            )}

            {isPaperTrading && (isBetaVersion || flags?.backtest) && (
              <BacktestTab
                htmlKey='backtest'
                sbtitle={sbtitleBacktest}
                onBacktestStart={onBacktestStart}
                saveStrategyOptions={saveStrategyOptions}
                onCancelProcess={onCancelProcess}
                {...props}
              />
            )}
            {(isBetaVersion || flags?.docs) && !isPaperTrading && (
              <IDETab
                htmlKey='view_in_ide'
                key='view_in_ide'
                hasErrors={hasErrorsInIDE}
                onSaveStrategy={onSaveStrategy}
                onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
                sbtitle={sbtitleIDE}
                setStrategyDirty={setStrategyDirty}
                onDefineIndicatorsChange={onDefineIndicatorsChange}
                evalSectionContent={evalSectionContent}
                setSectionErrors={setSectionErrors}
                sectionErrors={sectionErrors}
                setStrategy={setStrategy}
                strategy={strategy}
              />
            )}
            {(isBetaVersion || flags?.live_execution) && (
              <div
                htmlKey='settings'
                key='settings'
                sbtitle={sbtitleSettings}
                onClick={openStrategySettingsModal}
              />
            )}
          </StrategyEditorPanel>
          <RemoveExistingStrategyModal
            isOpen={isRemoveModalOpen}
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
          <StrategySettingsModal
            isOpen={isStrategySettingsModalOpen}
            onClose={onCloseModals}
            saveStrategyOptions={saveStrategyOptions}
            startExecution={onLaunchExecutionClick}
            startBacktest={onBacktestStart}
            strategySettingsModalType={strategySettingsModalType}
            strategyId={strategyId}
            strategyOptions={strategyOptions}
          />
          <LaunchStrategyModal
            onSubmit={saveStrategyAndStartExecution}
            isOpen={isLaunchStrategyModalOpen}
            onClose={onCloseModals}
            strategyId={strategyId}
          />
          <EditStrategyLabelModal
            isOpen={isEditStrategyLabelModalOpen}
            onClose={onCloseModals}
            strategy={strategy}
            onSubmit={onSaveAsStrategy}
          />
        </>
      )}
      <CreateNewStrategyFromModalOpen
        isOpen={createNewStrategyFromModalOpened}
        onClose={onCloseModals}
        onSubmit={onCreateStrategyFromExisted}
        currentStrategy={strategy}
        logInformation={logInformation}
      />
      <CreateNewStrategyModal
        isOpen={createNewStrategyModalOpen}
        onClose={onCloseModals}
        onSubmit={onCreateNewStrategy}
        logInformation={logInformation}
      />
      <OpenExistingStrategyModal
        isOpen={isOpenExistingStrategyModalOpen}
        onClose={onCloseModals}
        onOpen={onLoadStrategy}
      />
      <CancelProcessModal
        isOpen={isCancelProcessModalOpen}
        onClose={onCloseModals}
        onSubmit={_cancelProcess}
      />
      <SaveUnsavedChangesLaunchModal
        strategy={strategy}
        isOpen={isSaveStrategyBeforeLaunchModalOpen}
        onClose={onCloseModals}
        saveAndLaunch={saveAndLaunch}
        launchWithoutSaving={launchWithoutSaving}
      />
    </>
  )
}

StrategyEditor.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  setStrategy: PropTypes.func,
  backtestState: PropTypes.shape({
    gid: PropTypes.number,
  }).isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE),
  dsStopLiveStrategy: PropTypes.func.isRequired,
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  strategyDirty: PropTypes.bool.isRequired,
  setStrategyDirty: PropTypes.func.isRequired,
  gaCreateStrategy: PropTypes.func.isRequired,
  executionState: PropTypes.shape({
    executing: PropTypes.bool,
    loading: PropTypes.bool,
    loadingGid: PropTypes.string,
  }).isRequired,
  savedStrategies: PropTypes.objectOf(PropTypes.shape(STRATEGY_SHAPE)), // eslint-disable-line
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
  sectionErrors: PropTypes.objectOf(PropTypes.string).isRequired,
  cancelProcess: PropTypes.func.isRequired,
  changeTradingMode: PropTypes.func.isRequired,
  saveStrategyToExecuteToLS: PropTypes.func.isRequired,
  removeStrategyToExecuteFromLS: PropTypes.func.isRequired,
  pendingLiveStrategy: PropTypes.string,
  onDefineIndicatorsChange: PropTypes.func.isRequired,
  evalSectionContent: PropTypes.func.isRequired,
  setSectionErrors: PropTypes.func.isRequired,
  serviceStatus: PropTypes.shape({
    dmsControl: PropTypes.bool,
    algoWorker: PropTypes.bool,
    bfxClient: PropTypes.bool,
    strategyManager: PropTypes.bool,
  }).isRequired,
  logInformation: PropTypes.func.isRequired,
}

StrategyEditor.defaultProps = {
  moveable: false,
  removeable: false,
  setStrategy: () => {},
  strategy: {
    id: null,
    label: null,
  },
  indicators: [],
  pendingLiveStrategy: null,
}

export default memo(StrategyEditor)
