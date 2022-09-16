import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import Modal from '../../../ui/Modal'
import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import ExecutionTab from './tabs/StrategySettings.Execution'
import LeverageTab from './tabs/StrategySettings.Leverage'
import { getIsPaperTrading } from '../../../redux/selectors/ui'
import {
  EXECUTION_TYPES,
  getDefaultStrategyOptions,
  isExecutionInputsFullFilled,
  STRATEGY_OPTIONS_KEYS,
} from '../../../components/StrategyEditor/StrategyEditor.helpers'
import {
  MARGIN_TRADE_MODES,
  STRATEGY_SETTINGS_TABS,
} from './StrategySettingsModal.constants'
import OrdersTab from './tabs/StrategySettings.Orders'
import { STRATEGY_SHAPE } from '../../../constants/prop-types-shapes'

import './style.scss'

const getProcessedLocalState = (value) => String(AmountInput.processValue(value))

const StrategySettingsModal = (props) => {
  const {
    isOpen,
    onClose,
    saveStrategyOptions,
    startExecution,
    startBacktest,
    executionOptionsModalType,
    strategyOptions,
    strategyId,
  } = props
  const {
    capitalAllocation, stopLossPerc, maxDrawdownPerc, symbol,
  } = strategyOptions

  const [activeTab, setActiveTab] = useState(STRATEGY_SETTINGS_TABS.Execution)

  const [capitalAllocationValue, setCapitalAllocationValue] = useState('')
  const [stopLossPercValue, setStopLossPercValue] = useState('')
  const [maxDrawdownPercValue, setMaxDrawdownPercValue] = useState('')

  const [tradeOnMargin, setTradeOnMargin] = useState(false)
  const [marginTradeMode, setMarginTradeMode] = useState(
    MARGIN_TRADE_MODES.MAX,
  )
  const [leverageValue, setLeverageValue] = useState(10)
  const [increaseLeverage, setIncreaseLeverage] = useState(false)

  const [additionStopOrder, setAdditionStopOrder] = useState(false)
  const [stopOrderValue, setStopOrderValue] = useState('')

  const [pendingForSaveOptions, setPendingForSaveOptions] = useState(false)

  const isPaperTrading = useSelector(getIsPaperTrading)

  const isFullFilled = isExecutionInputsFullFilled(
    capitalAllocationValue,
    stopLossPercValue,
    maxDrawdownPercValue,
  )

  const isPairSelected = !_isEmpty(symbol)

  const { t } = useTranslation()

  const saveStrategyOptionsHelper = () => {
    saveStrategyOptions({
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: getProcessedLocalState(
        capitalAllocationValue,
      ),
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]:
        getProcessedLocalState(stopLossPercValue),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]:
        getProcessedLocalState(maxDrawdownPercValue),
    })
  }

  const onSave = () => {
    saveStrategyOptionsHelper()
    onClose()
  }

  const onSubmit = () => {
    if (!isFullFilled) {
      return
    }
    saveStrategyOptionsHelper()
    // We need to wait until options be saved
    setPendingForSaveOptions(true)
  }

  const getTabContentComponent = useCallback(
    (tab) => {
      switch (tab) {
        case STRATEGY_SETTINGS_TABS.Execution:
          return (
            <ExecutionTab
              {...props}
              isPaperTrading={isPaperTrading}
              capitalAllocation={capitalAllocationValue}
              setCapitalAllocationValue={setCapitalAllocationValue}
              stopLossPerc={stopLossPercValue}
              setStopLossPercValue={setStopLossPercValue}
              maxDrawdownPerc={maxDrawdownPercValue}
              setMaxDrawdownPercValue={setMaxDrawdownPercValue}
              symbol={symbol}
            />
          )

        case STRATEGY_SETTINGS_TABS.Leverage:
          return (
            <LeverageTab
              tradeOnMargin={tradeOnMargin}
              setTradeOnMargin={setTradeOnMargin}
              setMarginTradeMode={setMarginTradeMode}
              marginTradeMode={marginTradeMode}
              leverageValue={leverageValue}
              setLeverageValue={setLeverageValue}
              setIncreaseLeverage={setIncreaseLeverage}
              increaseLeverage={increaseLeverage}
              isPairSelected={isPairSelected}
            />
          )

        case STRATEGY_SETTINGS_TABS.Orders:
          return (
            <OrdersTab
              additionStopOrder={additionStopOrder}
              setAdditionStopOrder={setAdditionStopOrder}
              stopOrderValue={stopOrderValue}
              setStopOrderValue={setStopOrderValue}
              isPairSelected={isPairSelected}
            />
          )

        default:
          return null
      }
    },
    [
      props,
      isPaperTrading,
      capitalAllocationValue,
      stopLossPercValue,
      maxDrawdownPercValue,
      symbol,
      tradeOnMargin,
      marginTradeMode,
      leverageValue,
      increaseLeverage,
      isPairSelected,
      additionStopOrder,
      stopOrderValue,
    ],
  )

  const tabs = useMemo(() => {
    return _map(STRATEGY_SETTINGS_TABS, (tab) => ({
      key: tab,
      label: t(`executionOptionsModal.${tab}`),
      component: getTabContentComponent(tab),
    }))
  }, [t, getTabContentComponent])

  useEffect(() => {
    setCapitalAllocationValue(capitalAllocation)
    setMaxDrawdownPercValue(maxDrawdownPerc)
    setStopLossPercValue(stopLossPerc)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId, isOpen])

  useEffect(() => {
    if (
      pendingForSaveOptions
      && capitalAllocation === getProcessedLocalState(capitalAllocationValue)
      && maxDrawdownPerc === getProcessedLocalState(maxDrawdownPercValue)
      && stopLossPerc === getProcessedLocalState(stopLossPercValue)
    ) {
      // Continue process (execute or backtest) after options was saved
      const isExecution = executionOptionsModalType === EXECUTION_TYPES.LIVE
      onClose()
      setPendingForSaveOptions(false)
      if (isExecution) {
        startExecution()
      } else {
        startBacktest()
      }
    }
  }, [
    capitalAllocationValue,
    maxDrawdownPerc,
    maxDrawdownPercValue,
    pendingForSaveOptions,
    stopLossPerc,
    stopLossPercValue,
    capitalAllocation,
    executionOptionsModalType,
    onClose,
    startExecution,
    startBacktest,
  ])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('executionOptionsModal.title')}
      onSubmit={onSubmit}
      className='hfui-execution-options-modal-container'
      width={activeTab === STRATEGY_SETTINGS_TABS.Execution ? 900 : 600}
      textAlign='center'
    >
      <Modal.Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />
      <Modal.Footer>
        {!isPaperTrading ? (
          <Modal.Button secondary onClick={onClose}>
            {t('ui.closeBtn')}
          </Modal.Button>
        ) : !executionOptionsModalType ? (
          <Modal.Button primary onClick={onSave}>
            {t('ui.save')}
          </Modal.Button>
        ) : (
          <Modal.Button
            primary
            onClick={onSubmit}
            disabled={!isFullFilled || pendingForSaveOptions}
          >
            {t('strategyEditor.saveAndLaunchBtn')}
          </Modal.Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

StrategySettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  strategyOptions: STRATEGY_SHAPE.strategyOptions,
  startExecution: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  strategyId: PropTypes.string.isRequired,
  startBacktest: PropTypes.func.isRequired,
  executionOptionsModalType: PropTypes.string,
}

StrategySettingsModal.defaultProps = {
  executionOptionsModalType: null,
  strategyOptions: getDefaultStrategyOptions(),
}

export default StrategySettingsModal
