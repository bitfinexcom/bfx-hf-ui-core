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
import ExecutionOptionsModal from '../../modals/Strategy/ExecutionOptionsModal'
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
import { INDICATORS_ARRAY_SHAPE, STRATEGY_SHAPE } from '../../constants/prop-types-shapes'
import EditStrategyLabelModal from '../../modals/Strategy/EditStrategyLabelModal'

import './style.css'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const debug = Debug('hfui-ui:c:strategy-editor')

const StrategyEditor = (props) => {
  const {
    moveable,
    removeable,
    onRemove,
    authToken,
    gaCreateStrategy,
    backtestResults,
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
    executionId,
    onDefineIndicatorsChange,
    evalSectionContent,
    setSectionErrors,
    IDEcontent,
    setIDEcontent,
    serviceStatus,
    getCurrencySymbol,
  } = props
  const { t } = useTranslation()

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
    isExecutionOptionsModalOpen,,
    openExecutionOptionsModal,
    closeExecutionOptionsModal,
  ] = useToggle(false)
  const [
    isLaunchStrategyModalOpen,,
    openLaunchStrategyModal,
    closeLaunchStrategyModal,
  ] = useToggle(false)
  const [executionOptionsModalType, setExecutionOptionsModalType] = useState(null)

  const strategyOptions = _get(
    strategy,
    'strategyOptions',
    getDefaultStrategyOptions(),
  )

  const {
    symbol,
    timeframe,
    trades,
    candles,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
  } = strategyOptions

  const strategyQuote = getCurrencySymbol(symbol?.quote)
  const { executing, loadingGid } = executionState
  const { strategyManager: isStrategyManagerRunning } = serviceStatus

  const isFullFilled = isExecutionInputsFullFilled(
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
  )

  const strategyId = strategy?.id
  const strategyLabel = strategy?.label

  const onCloseModals = useCallback(() => {
    closeOpenExistingStrategyModal()
    closeCreateNewStrategyModal()
    closeRemoveModal()
    closeCreateNewStrategyFromModal()
    closeSaveStrategyAsModal()
    closeExecutionOptionsModal()
    closeCancelProcessModal()
    closeLaunchStrategyModal()
    closeSaveStrategyBeforeLaunchModal()
    closeEditStrategyLabelModal()

    // setTimeout is needed to prevent flickering when 'Save & Launch' execution options modal is closing
    setTimeout(() => {
      setExecutionOptionsModalType(null)
    }, 500)
  }, [
    closeCancelProcessModal,
    closeCreateNewStrategyFromModal,
    closeCreateNewStrategyModal,
    closeExecutionOptionsModal,
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
    (label, _newStrategy) => {
      gaCreateStrategy()

      const newStrategy = {
        ..._newStrategy,
        label,
        id: v4(),
      }

      // Need to delete inherited execution data of parent strategy
      delete newStrategy.executionId
      delete newStrategy.results
      delete newStrategy.startedOn
      delete newStrategy.stoppedOn

      saveStrategy(newStrategy)
      onLoadStrategy(newStrategy, true)

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
      }
    } catch (e) {
      debug('Error while importing strategy: %s', e)
    }
  }, [onCreateStrategyFromExisted])

  const onSaveStrategy = useCallback(() => {
    if (executionId) {
      const newLabel = t('strategyEditor.copyOfStrategy', {
        strategyName: strategyLabel,
      })
      onCreateStrategyFromExisted(newLabel, {
        ...strategy,
        strategyContent: IDEcontent,
      })
      return
    }

    saveStrategy({ ...strategy, strategyContent: IDEcontent })
    setStrategyDirty(false)
  }, [
    IDEcontent,
    executionId,
    onCreateStrategyFromExisted,
    saveStrategy,
    setStrategyDirty,
    strategy,
    strategyLabel,
    t,
  ])

  const onSaveAsStrategy = useCallback(
    (_newStrategy) => {
      const newStrategy = {
        ..._newStrategy,
        strategyContent: IDEcontent,
      }
      if (executionId) {
        const newLabel = t('strategyEditor.copyOfStrategy', {
          strategyName: strategyLabel,
        })
        onCreateStrategyFromExisted(newLabel, {
          ...newStrategy,
          strategyContent: IDEcontent,
        })
        return
      }

      setStrategy(newStrategy)
      saveStrategy(newStrategy)
      setStrategyDirty(false)
    },
    [
      IDEcontent,
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
    const { gid } = backtestResults

    cancelProcess(authToken, isPaperTrading, gid, loadingGid)
    closeCancelProcessModal()
  }, [
    authToken,
    backtestResults,
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
      onSaveAsStrategy({
        ...strategy,
        strategyOptions: { ...strategyOptions, ...newOptions },
      })
    },
    [onSaveAsStrategy, strategy, strategyOptions],
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
      openExecutionOptionsModal()
      setExecutionOptionsModalType(EXECUTION_TYPES.BACKTEST)
      return
    }

    dsExecuteBacktest(backtestArgs)
  }, [
    candles,
    dsExecuteBacktest,
    isFullFilled,
    openExecutionOptionsModal,
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

  const onLaunchExecutionClick = useCallback((forcedLaunch = false) => {
    if (strategyDirty && !forcedLaunch) {
      openSaveStrategyBeforeLaunchModal()
      return
    }

    if (isFullFilled) {
      openLaunchStrategyModal()
      return
    }

    setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
    openExecutionOptionsModal()
  }, [isFullFilled, openExecutionOptionsModal, openLaunchStrategyModal, openSaveStrategyBeforeLaunchModal, strategyDirty])

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
      openExecutionOptionsModal()
      setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
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
    openExecutionOptionsModal,
    strategy,
    saveStrategyToExecuteToLS,
  ])

  const loadStrategyAndStartExecution = useCallback(
    (strategyToLoad) => {
      if (!checkForAPIKeys(strategyToLoad)) {
        return
      }
      onLoadStrategy(strategyToLoad)
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

  const openNewTest = () => onLoadStrategy(strategy)

  const hasErrorsInIDE = useMemo(
    () => _some(_values(sectionErrors), (e) => !!e),
    [sectionErrors],
  )

  useEffect(() => {
    if (isPaperTrading || !pendingLiveStrategy || !isStrategyManagerRunning || executing || _isEmpty(savedStrategies)) {
      return
    }

    const strategyToLoad = savedStrategies[pendingLiveStrategy]
    if (_isEmpty(strategyToLoad)) {
      return
    }

    loadStrategyAndStartExecution(strategyToLoad)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedStrategies, executing, pendingLiveStrategy, isStrategyManagerRunning])

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
    ],
  )

  const sbtitleIDE = useCallback(
    ({ sidebarOpened }) => <IDETabTitle sidebarOpened={sidebarOpened} />,
    [],
  )

  const sbtitleBacktest = useCallback(
    ({ sidebarOpened }) => (
      <BacktestTabTitle
        results={backtestResults}
        sidebarOpened={sidebarOpened}
      />
    ),
    [backtestResults],
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
                openExecutionOptionsModal={openExecutionOptionsModal}
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
                results={backtestResults}
                onBacktestStart={onBacktestStart}
                saveStrategyOptions={saveStrategyOptions}
                onCancelProcess={onCancelProcess}
                openNewTest={openNewTest}
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
                IDEcontent={IDEcontent}
                setIDEcontent={setIDEcontent}
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
          <ExecutionOptionsModal
            isOpen={isExecutionOptionsModalOpen}
            onClose={onCloseModals}
            saveStrategyOptions={saveStrategyOptions}
            capitalAllocation={capitalAllocation}
            stopLossPerc={stopLossPerc}
            maxDrawdownPerc={maxDrawdownPerc}
            startExecution={onLaunchExecutionClick}
            startBacktest={onBacktestStart}
            executionOptionsModalType={executionOptionsModalType}
            isFullFilled={isFullFilled}
            strategyId={strategyId}
            strategyQuote={strategyQuote}
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
        currentStrategyLabel={strategyLabel}
      />
      <CreateNewStrategyModal
        isOpen={createNewStrategyModalOpen}
        onClose={onCloseModals}
        onSubmit={onCreateNewStrategy}
        onImportStrategy={onImportStrategy}
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
  backtestResults: PropTypes.shape({
    gid: PropTypes.number,
    strategy: PropTypes.object, // eslint-disable-line
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
  executionId: PropTypes.string,
  onDefineIndicatorsChange: PropTypes.func.isRequired,
  evalSectionContent: PropTypes.func.isRequired,
  setSectionErrors: PropTypes.func.isRequired,
  IDEcontent: PropTypes.objectOf(PropTypes.string).isRequired,
  setIDEcontent: PropTypes.func.isRequired,
  serviceStatus: PropTypes.shape({
    dmsControl: PropTypes.bool,
    algoWorker: PropTypes.bool,
    bfxClient: PropTypes.bool,
    strategyManager: PropTypes.bool,
  }).isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
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
  executionId: null,
  pendingLiveStrategy: null,
}

export default memo(StrategyEditor)
