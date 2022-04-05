import React, { memo, useState, useEffect } from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _forEach from 'lodash/forEach'
import _size from 'lodash/size'
import _find from 'lodash/find'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { saveAsJSON, readJSONFile } from '../../util/ui'
import { MAX_STRATEGY_LABEL_LENGTH } from '../../constants/variables'
import Templates from './templates'
import StrategyEditorPanel from './components/StrategyEditorPanel'
import CreateNewStrategyModal from '../../modals/Strategy/CreateNewStrategyModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import OpenExistingStrategyModal from '../../modals/Strategy/OpenExistingStrategyModal'
import EmptyContent from './components/StrategyEditorEmpty'
import StrategyTab from './tabs/StrategyTab'
import IDETab from './tabs/IDETab'
import { getDefaultMarket } from '../../util/market'
import StrategiesMenuSideBarParams from './components/StrategiesMenuSideBarParams'
import HelpTab from './tabs/HelpTab'
import StrategyPaused from './components/StrategyPaused'
import StrategyRunned from './components/StrategyRunned'

import './style.css'

const debug = Debug('hfui-ui:c:strategy-editor')

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
    selectStrategy,
    setStrategy,
    strategy,
    onSaveStrategy,
    onLoadStrategy,
    dsExecuteLiveStrategy,
    dsStopLiveStrategy,
    options,
    markets,
    onStrategySelect,
    evalSectionContent,
    sectionErrors,
  } = props
  const { t } = useTranslation()
  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [createNewStrategyModalOpen, setCreateNewStrategyModalOpen] = useState(false)
  const [openExistingStrategyModalOpen, setOpenExistingStrategyModalOpen] = useState(false)
  const [symbol, setSymbol] = useState(
    options.symbol
      ? _find(markets, (m) => m.wsID === options.symbol)
      : getDefaultMarket(markets),
  )
  const [timeframe, setTimeframe] = useState(options.tf || DEFAULT_TIMEFRAME)
  const [trades, setTrades] = useState(
    options.includeTrades || DEFAULT_USE_TRADES,
  )
  const [candleSeed, setCandleSeed] = useState(
    options.seedCandleCount || DEFAULT_SEED_COUNT,
  )
  const [margin, setMargin] = useState(options.margin || DEFAULT_USE_MARGIN)
  const [paramsOpen, setParamsOpen] = useState(false)

  const onCloseModals = () => {
    setOpenExistingStrategyModalOpen(false)
    setCreateNewStrategyModalOpen(false)
    setIsRemoveModalOpened(false)
  }

  const onCreateNewStrategy = (label, templateLabel, content = {}) => {
    const newStrategy = { label, ...content }
    const template = _find(Templates, (_t) => _t.label === templateLabel)

    if (!template) {
      debug('unknown template: %s', templateLabel)
    }

    const templateSections = _keys(template)

    _forEach(templateSections, (s) => {
      if (s === 'label') return

      newStrategy[s] = template[s]
    })

    setSectionErrors({})
    setStrategyDirty(true)
    selectStrategy(newStrategy)

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
        onCreateNewStrategy(newStrategy.label, null, newStrategy)
      }
    } catch (e) {
      debug('Error while importing strategy: %s', e)
    }
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
        />
      ) : (
        <StrategyEditorPanel
          onRemove={onRemove}
          moveable={moveable}
          removeable={removeable}
          execRunning={
            backtestResults.executing
            || backtestResults.loading
            || liveExecuting
            || liveLoading
          }
          strategyDirty={strategyDirty}
          strategy={strategy}
          // strategies={strategies}
          strategyId={strategyId}
          onOpenSelectModal={() => setOpenExistingStrategyModalOpen(true)}
          onOpenCreateModal={() => setCreateNewStrategyModalOpen(true)}
          onOpenRemoveModal={() => setIsRemoveModalOpened(true)}
          onSaveStrategy={onSaveStrategy}
          onRemoveStrategy={onRemoveStrategy}
          onExportStrategy={onExportStrategy}
          onImportStrategy={onImportStrategy}
          onSideTabChange={onSideTabChange}
          preSidebarComponents={preSidebar}
        >
          <StrategyTab
            sbtitle={(
              <>
                Strategy
                <StrategiesMenuSideBarParams
                  paramsOpen={paramsOpen}
                  setParamsOpen={setParamsOpen}
                  startExecution={startExecution}
                  stopExecution={stopExecution}
                  onLoadStrategy={onLoadStrategy}
                  onExportStrategy={onExportStrategy}
                  onSaveStrategy={onSaveStrategy}
                />
              </>
            )}
            sbicon={<Icon name='file-code-o' />}
            {...props}
          />
          <IDETab
            sbtitle='View in IDE'
            sbicon={<Icon name='edit' />}
            {...props}
          />
          <HelpTab
            sbtitle='Help'
            sbicon={<Icon name='question-circle-o' />}
          />
        </StrategyEditorPanel>
      )}
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
    </>
  )
}

StrategyEditor.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  strategyId: PropTypes.string,
  // renderResults: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
  onStrategySelect: PropTypes.func.isRequired,
  gaCreateStrategy: PropTypes.func.isRequired,
  // onIndicatorsChange: PropTypes.func.isRequired,
  // clearBacktestOptions: PropTypes.func.isRequired,
  liveExecuting: PropTypes.bool.isRequired,
  liveLoading: PropTypes.bool.isRequired,
  strategyContent: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.oneOf([null]).isRequired,
    ]),
  ),
  // settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
}

StrategyEditor.defaultProps = {
  strategyId: '',
  moveable: false,
  removeable: false,
  // renderResults: true,
  strategyContent: {},
  backtestResults: {},
  // settingsTheme: THEMES.DARK,
}

export default memo(StrategyEditor)
