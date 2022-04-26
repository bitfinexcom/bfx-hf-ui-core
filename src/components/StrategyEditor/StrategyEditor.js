import React, { memo, useState } from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _find from 'lodash/find'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { saveAsJSON, readJSONFile } from '../../util/ui'
import { MAX_STRATEGY_LABEL_LENGTH } from '../../constants/variables'
import StrategyEditorPanel from './components/StrategyEditorPanel'
import CreateNewStrategyModal from '../../modals/Strategy/CreateNewStrategyModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import OpenExistingStrategyModal from '../../modals/Strategy/OpenExistingStrategyModal'
import EmptyContent from './components/StrategyEditorEmpty'
import StrategyTab from './tabs/StrategyTab'
import BacktestTab from './tabs/BacktestTab'
import IDETab from './tabs/IDETab'
import { getDefaultMarket } from '../../util/market'
import StrategiesMenuSideBarParams from './components/StrategiesMenuSideBarParams'
import HelpTab from './tabs/HelpTab'
import StrategyPaused from './components/StrategyPaused'
import StrategyRunned from './components/StrategyRunned'
import CreateNewStrategyFromModalOpen from '../../modals/Strategy/CreateNewStrategyFromModal'
import SaveStrategyAsModal from '../../modals/Strategy/SaveStrategyAsModal/SaveStrategyAsModal'

import './style.css'

const debug = Debug('hfui-ui:c:strategy-editor')
const ONE_MIN = 1000 * 60
const ONE_HOUR = ONE_MIN * 60
const ONE_DAY = ONE_HOUR * 24

const DEFAULT_TIMEFRAME = '1m'
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false
const DEFAULT_SEED_COUNT = 150

const StrategyEditor = (props) => {
  const {
    moveable,
    removeable,
    strategyId,
    onRemove,
    authToken,
    onStrategyChange,
    gaCreateStrategy,
    strategyContent,
    backtestResults,
    liveExecuting,
    liveLoading,
    strategyDirty,
    setStrategyDirty,
    setSectionErrors,
    onDefineIndicatorsChange,
    setStrategy,
    strategy,
    onLoadStrategy,
    dsExecuteLiveStrategy,
    dsStopLiveStrategy,
    options,
    markets,
    onStrategySelect,
    onSave,
    isPaperTrading,
    dsExecuteBacktest,
    setBacktestOptions,
  } = props
  const { t } = useTranslation()
  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [createNewStrategyModalOpen, setCreateNewStrategyModalOpen] = useState(false)
  const [createNewStrategyFromModalOpen, setCreateNewStrategyFromModalOpen] = useState(false)
  const [openExistingStrategyModalOpen, setOpenExistingStrategyModalOpen] = useState(false)
  const [isSaveStrategyAsModalOpen, setIsSaveStrategyModalOpen] = useState(false)
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
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - ONE_DAY),
  )
  const [endDate, setEndDate] = useState(
    new Date(Date.now() - (ONE_MIN * 15)),
  )
  const [margin, setMargin] = useState(options.margin || DEFAULT_USE_MARGIN)
  const [paramsOpen, setParamsOpen] = useState(false)
  const execRunning = backtestResults.executing || backtestResults.loading || liveExecuting || liveLoading

  const optionsProps = {
    timeframe, candles, setCandles, symbol, setSymbol, setTimeframe, trades, setTrades, candleSeed, setCandleSeed, margin, setMargin, startDate, setStartDate, endDate, setEndDate,
  }

  const onCloseModals = () => {
    setOpenExistingStrategyModalOpen(false)
    setCreateNewStrategyModalOpen(false)
    setIsRemoveModalOpened(false)
    setCreateNewStrategyFromModalOpen(false)
    setIsSaveStrategyModalOpen(false)
  }

  const onCreateNewStrategy = (label, content = {}) => {
    const newStrategy = { ...content, label }

    setSectionErrors({})
    setStrategyDirty(true)
    onStrategySelect(newStrategy)

    if (newStrategy.defineIndicators) {
      onDefineIndicatorsChange(newStrategy.defineIndicators)
    }

    onCloseModals()
  }

  const onRemoveStrategy = () => {
    const { id = strategyId } = strategy
    onCloseModals()
    onRemove(authToken, id)
    setStrategy(null)
    onStrategyChange(null)
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
    onSave(authToken, { ...strategy, savedTs: Date.now() })
    setStrategyDirty(false)
  }

  const onSaveAsStrategy = (newStrategy) => {
    setStrategy(newStrategy)
    onSave(authToken, { ...newStrategy, savedTs: Date.now() })
    setStrategyDirty(false)
  }

  const onBacktestStart = () => {
    // todo: check for errors
    const startNum = new Date(startDate).getTime()
    const endNum = new Date(endDate).getTime()

    dsExecuteBacktest(startNum, endNum, symbol?.wsID, timeframe, true, false, strategy)
    // setBacktestOptions(optionsProps)
  }

  const startExecution = () => {
    onSaveStrategy()
    dsExecuteLiveStrategy(
      authToken,
      strategy.label,
      symbol?.wsID,
      timeframe,
      trades,
      strategyContent,
      candleSeed,
      margin,
      isPaperTrading,
    )
  }

  const stopExecution = () => {
    dsStopLiveStrategy(authToken)
  }

  const onSideTabChange = (tab) => {
    if (tab === 0) {
      setParamsOpen(true)
    }
  }

  const preSidebar = liveExecuting ? (
    <StrategyRunned />
  ) : (
    <StrategyPaused />
  )

  return (
    <>
      {!strategy || _isEmpty(strategy) ? (
        <EmptyContent
          openCreateNewStrategyModal={() => setCreateNewStrategyModalOpen(true)}
          openCreateNewStrategyFromModal={() => setCreateNewStrategyFromModalOpen(true)}
        />
      ) : (
        <StrategyEditorPanel
          moveable={moveable}
          removeable={removeable}
          onRemoveStrategy={onRemoveStrategy}
          onSideTabChange={onSideTabChange}
          preSidebarComponents={preSidebar}
        >
          <StrategyTab
            htmlKey='strategy'
            sbtitle={(
              <>
                {t('strategyEditor.strategyTab')}
                <StrategiesMenuSideBarParams
                  paramsOpen={paramsOpen}
                  setParamsOpen={setParamsOpen}
                  startExecution={startExecution}
                  stopExecution={stopExecution}
                  onLoadStrategy={onLoadStrategy}
                  onExportStrategy={onExportStrategy}
                  onSaveStrategy={onSaveStrategy}
                  execRunning={execRunning}
                  onOpenRemoveModal={() => setIsRemoveModalOpened(true)}
                  onOpenCreateStrategyModal={() => setCreateNewStrategyModalOpen(true)}
                  onOpenCreateStrategyFromModal={() => setCreateNewStrategyFromModalOpen(true)}
                  onOpenSaveStrategyAsModal={() => setIsSaveStrategyModalOpen(true)}
                  onImportStrategy={onImportStrategy}
                  strategy={strategy}
                  strategyId={strategyId}
                />
              </>
            )}
            sbicon={<Icon name='file-code-o' />}
            onOpenSaveStrategyAsModal={() => setIsSaveStrategyModalOpen(true)}
            isPaperTrading={isPaperTrading}
            {...optionsProps}
            {...props}
          />
          {isPaperTrading && (
            <BacktestTab
              htmlKey='backtest'
              sbtitle={t('strategyEditor.backtestTab')}
              sbicon={<Icon name='repeat' />}
              onOpenSaveStrategyAsModal={() => setIsSaveStrategyModalOpen(true)}
              results={backtestResults}
              // todo: add useCandles / useTrades params
              onBacktestStart={onBacktestStart}
              {...optionsProps}
              {...props}
            />
          )}
          <IDETab
            htmlKey='view_in_ide'
            sbtitle={t('strategyEditor.viewInIDETab')}
            sbicon={<Icon name='edit' />}
            {...props}
          />
          <HelpTab
            htmlKey='help'
            sbtitle={t('strategyEditor.helpTab')}
            sbicon={<Icon name='question-circle-o' />}
          />
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
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  setStrategy: PropTypes.func,
  backtestResults: PropTypes.objectOf(PropTypes.any).isRequired,
  options: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.bool,
  ])).isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  dsStopLiveStrategy: PropTypes.func.isRequired,
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  onDefineIndicatorsChange: PropTypes.func.isRequired,
  indicators: PropTypes.arrayOf(PropTypes.object),
  strategyDirty: PropTypes.bool.isRequired,
  setStrategyDirty: PropTypes.func.isRequired,
  setSectionErrors: PropTypes.func.isRequired,
  onStrategySelect: PropTypes.func.isRequired,
  gaCreateStrategy: PropTypes.func.isRequired,
  liveExecuting: PropTypes.bool.isRequired,
  liveLoading: PropTypes.bool.isRequired,
  strategyContent: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number,
      PropTypes.oneOf([null]).isRequired,
    ]),
  ),
  onSave: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  setBacktestOptions: PropTypes.func.isRequired,
  dsExecuteBacktest: PropTypes.func.isRequired,
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
}

export default memo(StrategyEditor)
