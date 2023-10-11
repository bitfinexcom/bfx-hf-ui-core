import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import _forEach from 'lodash/forEach'
import _includes from 'lodash/includes'
import _get from 'lodash/get'
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

const { getIsDerivativePair: _getIsDerivativePair } = reduxSelectors

const convertNumberToString = (value) => (value ? String(AmountInput.processValue(value)) : '')

const StrategySettingsModal = (props) => {
  const {
    isOpen,
    onClose,
    saveStrategyOptions,
    startExecution,
    startBacktest,
    strategySettingsModalType,
    strategyOptions,
    strategyId,
  } = props
  const {
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
    symbol,
    margin,
    useMaxLeverage,
    increaseLeverage: savedIncreaseLeverage,
    leverage,
    addStopOrder = false,
    stopOrderPercent,
  } = strategyOptions

  const [activeTab, setActiveTab] = useState(STRATEGY_SETTINGS_TABS.Execution)
  const [isDirty, setIsDirty] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)

  const [capitalAllocationValue, setCapitalAllocationValue] = useState('')
  const [stopLossPercValue, setStopLossPercValue] = useState('')
  const [maxDrawdownPercValue, setMaxDrawdownPercValue] = useState('')

  const [tradeOnMargin, setTradeOnMargin] = useState(false)
  const [marginTradeMode, setMarginTradeMode] = useState(
    MARGIN_TRADE_MODES.MAX,
  )
  const [leverageValue, setLeverageValue] = useState('10')
  const [increaseLeverage, setIncreaseLeverage] = useState(false)

  const [additionStopOrder, setAdditionStopOrder] = useState(false)
  const [stopOrderValue, setStopOrderValue] = useState('')

  const [pendingForSaveOptions, setPendingForSaveOptions] = useState(false)

  const isPaperTrading = useSelector(getIsPaperTrading)
  const getIsDerivativePair = useSelector(_getIsDerivativePair)

  const isFullFilled = isExecutionInputsFullFilled(
    capitalAllocationValue,
    stopLossPercValue,
    maxDrawdownPercValue,
  )

  const isPairSelected = !_isEmpty(symbol)
  const isDerivativePair = useMemo(
    () => getIsDerivativePair(symbol.wsID),
    [symbol, getIsDerivativePair],
  )

  const { t } = useTranslation()

  const saveStrategyOptionsHelper = () => {
    const optionsToSave = {
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: convertNumberToString(
        capitalAllocationValue,
      ),
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]:
        convertNumberToString(stopLossPercValue),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]:
        convertNumberToString(maxDrawdownPercValue),

      [STRATEGY_OPTIONS_KEYS.MARGIN]: tradeOnMargin,
      [STRATEGY_OPTIONS_KEYS.ADD_STOP_ORDER]: additionStopOrder,
    }

    if (tradeOnMargin) {
      optionsToSave[STRATEGY_OPTIONS_KEYS.USE_MAX_LEVERAGE] = marginTradeMode === MARGIN_TRADE_MODES.MAX
      optionsToSave[STRATEGY_OPTIONS_KEYS.LEVERAGE] = convertNumberToString(leverageValue)
      optionsToSave[STRATEGY_OPTIONS_KEYS.INCREASE_LEVERAGE] = increaseLeverage
    }
    if (additionStopOrder) {
      optionsToSave[STRATEGY_OPTIONS_KEYS.STOP_ORDER_PERC] = stopOrderValue
    }
    saveStrategyOptions(optionsToSave)
    setIsDirty(false)
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
              setHasErrors={setHasErrors}
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
              disabledInputs={!isPaperTrading || !isPairSelected}
              isDerivativePair={isDerivativePair}
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
              setHasErrors={setHasErrors}
              isPaperTrading={isPaperTrading}
              disabledInputs={!isPaperTrading || !isPairSelected}
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
      isDerivativePair,
    ],
  )

  const isMarginPair = useMemo(
    () => _includes(_get(symbol, 'contexts', []), 'm'),
    [symbol],
  )

  const tabsConfig = useMemo(() => {
    const tabs = []

    _forEach(STRATEGY_SETTINGS_TABS, (tab) => {
      if (
        tab === STRATEGY_SETTINGS_TABS.Leverage
        && !(isMarginPair || isDerivativePair)
      ) {
        return
      }
      tabs.push({
        key: tab,
        label: t(`strategySettingsModal.${tab}`),
        component: getTabContentComponent(tab),
      })
    })

    return tabs
  }, [t, getTabContentComponent, isMarginPair, isDerivativePair])

  useEffect(() => {
    setCapitalAllocationValue(convertNumberToString(capitalAllocation))
    setMaxDrawdownPercValue(convertNumberToString(maxDrawdownPerc))
    setStopLossPercValue(convertNumberToString(stopLossPerc))
    setActiveTab(STRATEGY_SETTINGS_TABS.Execution)

    if (!margin && isDerivativePair) {
      setTradeOnMargin(true)
    } else {
      setTradeOnMargin(margin)
    }

    if (!useMaxLeverage) {
      setMarginTradeMode(MARGIN_TRADE_MODES.FIXED)
    }

    if (leverage) {
      setLeverageValue(convertNumberToString(leverage))
    }
    if (savedIncreaseLeverage) {
      setIncreaseLeverage(savedIncreaseLeverage)
    }

    setAdditionStopOrder(addStopOrder)
    if (stopOrderPercent) {
      setStopOrderValue(convertNumberToString(stopOrderPercent))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId, isOpen])

  useEffect(() => {
    if (
      pendingForSaveOptions
      && capitalAllocation === convertNumberToString(capitalAllocationValue)
      && maxDrawdownPerc === convertNumberToString(maxDrawdownPercValue)
      && stopLossPerc === convertNumberToString(stopLossPercValue)
    ) {
      // Continue process (execute or backtest) after options was saved
      const isExecution = strategySettingsModalType === EXECUTION_TYPES.LIVE
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
    strategySettingsModalType,
    onClose,
    startExecution,
    startBacktest,
  ])

  useEffect(() => {
    if (
      convertNumberToString(capitalAllocation) !== capitalAllocationValue
      || convertNumberToString(maxDrawdownPerc) !== maxDrawdownPercValue
      || convertNumberToString(stopLossPerc) !== stopLossPercValue
      || margin !== tradeOnMargin
      || convertNumberToString(leverage) !== leverageValue
      || savedIncreaseLeverage !== increaseLeverage
      || addStopOrder !== additionStopOrder
      || convertNumberToString(stopOrderPercent) !== stopOrderValue
    ) {
      setIsDirty(true)
    } else {
      setIsDirty(false)
    }
  }, [
    isDirty,
    capitalAllocation,
    capitalAllocationValue,
    maxDrawdownPerc,
    maxDrawdownPercValue,
    stopLossPerc,
    stopLossPercValue,
    margin,
    tradeOnMargin,
    leverage,
    leverageValue,
    savedIncreaseLeverage,
    increaseLeverage,
    addStopOrder,
    additionStopOrder,
    stopOrderPercent,
    stopOrderValue,
  ])
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('strategySettingsModal.title')}
      onSubmit={onSubmit}
      className='hfui-execution-options-modal-container'
      width={activeTab === STRATEGY_SETTINGS_TABS.Execution ? 900 : 600}
      textAlign='center'
    >
      <Modal.Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabsConfig}
      />
      <Modal.Footer>
        {!isPaperTrading ? (
          <Modal.Button secondary onClick={onClose}>
            {t('ui.closeBtn')}
          </Modal.Button>
        ) : !strategySettingsModalType ? (
          <Modal.Button
            primary
            onClick={onSave}
            disabled={!isDirty || hasErrors}
          >
            {t('ui.save')}
          </Modal.Button>
        ) : (
          <Modal.Button
            primary
            onClick={onSubmit}
            disabled={
              !isDirty || !isFullFilled || pendingForSaveOptions || hasErrors
            }
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
  strategySettingsModalType: PropTypes.string,
}

StrategySettingsModal.defaultProps = {
  strategySettingsModalType: null,
  strategyOptions: getDefaultStrategyOptions(),
}

export default StrategySettingsModal
