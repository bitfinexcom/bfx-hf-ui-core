import React, { memo, useMemo, useState } from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _some from 'lodash/some'
import _values from 'lodash/values'
import _find from 'lodash/find'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { v4 } from 'uuid'
import { saveAsJSON, readJSONFile } from '../../util/ui'
import { MAX_STRATEGY_LABEL_LENGTH } from '../../constants/variables'
import StrategyEditorPanel from './components/StrategyEditorPanel'
import CreateNewStrategyModal from '../../modals/Strategy/CreateNewStrategyModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import OpenExistingStrategyModal from '../../modals/Strategy/OpenExistingStrategyModal'
import EmptyContent from './components/StrategyEditorEmpty'
import StrategyTab from './tabs/StrategyTab'
import BacktestTab from './tabs/BacktestTab'
import ExecParamsTab from './tabs/ExecParamsTab'
import IDETab from './tabs/IDETab'
import { getDefaultMarket } from '../../util/market'
import CreateNewStrategyFromModalOpen from '../../modals/Strategy/CreateNewStrategyFromModal'
import SaveStrategyAsModal from '../../modals/Strategy/SaveStrategyAsModal/SaveStrategyAsModal'
import StrategyTabTitle from './tabs/StrategyTab.Title'
import BacktestTabTitle from './tabs/BacktestTab.Title'
import ExecParamsTabTitle from './tabs/ExecParamsTab.Title'
import IDETabTitle from './tabs/IDETab.Title'
import ExecutionOptionsModal from '../../modals/Strategy/ExecutionOptionsModal'
import AmountInput from '../OrderForm/FieldComponents/input.amount'

import './style.css'

const debug = Debug('hfui-ui:c:strategy-editor')
const ONE_MIN = 1000 * 60
const ONE_HOUR = ONE_MIN * 60
const ONE_DAY = ONE_HOUR * 24

const DEFAULT_TIMEFRAME = '1m'
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false
const DEFAULT_SEED_COUNT = 150

const EXECUTION_TYPES = Object.freeze({
  LIVE: 'LIVE',
  BACKTEST: 'BACKTEST',
})

const StrategyEditor = (props) => {
  const {
    moveable,
    removeable,
    strategyId,
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
    options,
    markets,
    saveStrategy,
    isPaperTrading,
    dsExecuteBacktest,
    // setBacktestOptions,
    showError,
    flags,
    isBetaVersion,
    allExecutionResults,
    executing,
    sectionErrors,
    liveResults,
    runningStrategiesMapping,
  } = props
  const { t } = useTranslation()
  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [createNewStrategyModalOpen, setCreateNewStrategyModalOpen] = useState(false)
  const [createNewStrategyFromModalOpen, setCreateNewStrategyFromModalOpen] = useState(false)
  const [openExistingStrategyModalOpen, setOpenExistingStrategyModalOpen] = useState(false)
  const [isSaveStrategyAsModalOpen, setIsSaveStrategyModalOpen] = useState(false)
  const [isExecutionOptionsModalOpen, setIsExecutionOptionsModalOpen] = useState(false)
  const [executionOptionsModalType, setExecutionOptionsModalType] = useState(EXECUTION_TYPES.LIVE)

  const [symbol, setSymbol] = useState(
    options.symbol
      ? _find(markets, (m) => m.wsID === options.symbol)
      : getDefaultMarket(markets),
  )
  const [timeframe, setTimeframe] = useState(options.tf || DEFAULT_TIMEFRAME)
  const [trades, setTrades] = useState(
    options.includeTrades || DEFAULT_USE_TRADES,
  )
  const [candles, setCandles] = useState(false)
  const [candleSeed, setCandleSeed] = useState(
    options.seedCandleCount || DEFAULT_SEED_COUNT,
  )
  const [startDate, setStartDate] = useState(new Date(Date.now() - ONE_DAY))
  const [endDate, setEndDate] = useState(new Date(Date.now() - ONE_MIN * 15))
  const [margin, setMargin] = useState(options.margin || DEFAULT_USE_MARGIN)
  const [capitalAllocation, setCapitalAllocation] = useState('')
  const [stopLossPerc, setStopLossPerc] = useState('')
  const [maxDrawdownPerc, setMaxDrawdownPerc] = useState('')
  const [capitalAllocationError, setCapitalAllocationError] = useState('')

  const capitalAllocationHandler = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    if (error) {
      setCapitalAllocationError(error)
      return
    }
    setCapitalAllocation(processed)
  }

  const isFullFilled = capitalAllocation && stopLossPerc && maxDrawdownPerc

  const runningStrategyID = runningStrategiesMapping[strategyId]
  const currentStrategyResults = liveResults?.[runningStrategyID] || {}
  const constraints = {
    allocation: Number(capitalAllocation),
    percStopLoss: Number(stopLossPerc),
    maxDrawdown: Number(maxDrawdownPerc),
  }

  const optionsProps = {
    timeframe,
    candles,
    setCandles,
    symbol,
    setSymbol,
    setTimeframe,
    trades,
    setTrades,
    candleSeed,
    setCandleSeed,
    margin,
    setMargin,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
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
  }

  const onCreateNewStrategy = (label, content = {}) => {
    const newStrategy = { ...content, label, id: v4() }
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

  const onSaveStrategy = () => {
    saveStrategy(strategy)
    setStrategyDirty(false)
  }

  const onSaveAsStrategy = (newStrategy) => {
    setStrategy(newStrategy)
    saveStrategy(newStrategy)
    setStrategyDirty(false)
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
    // setBacktestOptions(optionsProps)
  }

  const startExecution = () => {
    if (!isFullFilled) {
      setIsExecutionOptionsModalOpen(true)
      setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
      return
    }
    onSaveStrategy()
    dsExecuteLiveStrategy(
      authToken,
      strategyId,
      strategy.label,
      symbol?.wsID,
      timeframe,
      trades,
      strategyContent,
      candleSeed,
      margin,
      isPaperTrading,
      constraints,
    )
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
    setIsExecutionOptionsModalOpen(true)
    setExecutionOptionsModalType(EXECUTION_TYPES.LIVE)
  }

  return (
    <>
      {!strategy || _isEmpty(strategy) ? (
        <EmptyContent
          openCreateNewStrategyModal={openCreateNewStrategyModal}
          openCreateNewStrategyFromModal={openCreateNewStrategyFromModal}
          isPaperTrading={isPaperTrading}
        />
      ) : (
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
                  startExecution={startExecution}
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
                  executionResults={execResults}
                  selectedTab={selectedTab}
                  sidebarOpened={sidebarOpened}
                  strategyDirty={strategyDirty}
                />
              )}
              onOpenSaveStrategyAsModal={openSaveStrategyAsModal}
              isPaperTrading={isPaperTrading}
              startExecution={startExecution}
              stopExecution={stopExecution}
              executionResults={execResults}
              onSaveAsStrategy={onSaveAsStrategy}
              openExecutionOptionsModal={openExecutionOptionsModal}
              {...optionsProps}
              {...props}
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
              {...optionsProps}
              {...props}
            />
          )}
          {(isBetaVersion || flags?.docs) && (
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
          {isBetaVersion && (
            <ExecParamsTab
              htmlKey='exec_params'
              key='exec_params'
              capitalAllocation={capitalAllocation}
              capitalAllocationHandler={capitalAllocationHandler}
              capitalAllocationError={capitalAllocationError}
              stopLossPerc={stopLossPerc}
              setStopLossPerc={setStopLossPerc}
              maxDrawdownPerc={maxDrawdownPerc}
              setMaxDrawdownPerc={setMaxDrawdownPerc}
              sbtitle={({ sidebarOpened }) => (
                <ExecParamsTabTitle
                  hasErrors={!isFullFilled}
                  sidebarOpened={sidebarOpened}
                />
              )}
            />
          )}
        </StrategyEditorPanel>
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
        capitalAllocation={capitalAllocation}
        setCapitalAllocation={setCapitalAllocation}
        stopLossPerc={stopLossPerc}
        setStopLossPerc={setStopLossPerc}
        maxDrawdownPerc={maxDrawdownPerc}
        setMaxDrawdownPerc={setMaxDrawdownPerc}
        startExecution={
          executionOptionsModalType === EXECUTION_TYPES.LIVE
            ? startExecution
            : onBacktestStart
        }
      />
    </>
  )
}

StrategyEditor.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  strategyId: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
  markets: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
  setStrategy: PropTypes.func,
  backtestResults: PropTypes.objectOf(PropTypes.any).isRequired, // eslint-disable-line
  options: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  ).isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  dsStopLiveStrategy: PropTypes.func.isRequired,
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line
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
  saveStrategy: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  // setBacktestOptions: PropTypes.func.isRequired,
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
  strategyId: '',
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
