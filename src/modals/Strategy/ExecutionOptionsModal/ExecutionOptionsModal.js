import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'
import Modal from '../../../ui/Modal'
import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../components/OrderForm/FieldComponents/input.percent'

import ExecutionOptionsBody from './ExecutionOptionsBody'
import { getIsPaperTrading } from '../../../redux/selectors/ui'
import {
  EXECUTION_TYPES,
  isExecutionInputsFullFilled,
  STRATEGY_OPTIONS_KEYS,
} from '../../../components/StrategyEditor/StrategyEditor.helpers'

import './style.scss'

const ExecutionOptionsModal = (props) => {
  const {
    isOpen,
    onClose,
    saveStrategyOptions,
    startExecution,
    startBacktest,
    executionOptionsModalType,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
    strategyId,
  } = props
  const [capitalAllocationValue, setCapitalAllocationValue] = useState('')
  const [stopLossPercValue, setStopLossPercValue] = useState('')
  const [maxDrawdownPercValue, setMaxDrawdownPercValue] = useState('')

  const [capitalAllocationError, setCapitalAllocationError] = useState('')
  const [stopLossPercError, setStopLossError] = useState('')
  const [maxDrawdownError, setMaxDrawdownError] = useState('')

  const [pendingForSaveOptions, setPendingForSaveOptions] = useState(false)

  const isPaperTrading = useSelector(getIsPaperTrading)

  const isFullFilled = isExecutionInputsFullFilled(
    capitalAllocationValue,
    stopLossPercValue,
    maxDrawdownPercValue,
  )

  const { t } = useTranslation()

  const capitalAllocationHandler = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setCapitalAllocationError(error)
    setCapitalAllocationValue(processed)
  }

  const stopLossPercHandler = (v) => {
    const error = PercentInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setStopLossError(error)
    setStopLossPercValue(processed)
  }

  const maxDrawdownHandler = (v) => {
    const error = PercentInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setMaxDrawdownError(error)
    setMaxDrawdownPercValue(processed)
  }

  const onSave = () => {
    saveStrategyOptions({
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: capitalAllocationValue,
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: stopLossPercValue,
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: maxDrawdownPercValue,
    })
    onClose()
  }

  const onSubmit = () => {
    if (!isFullFilled) {
      return
    }
    saveStrategyOptions({
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: capitalAllocationValue,
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: stopLossPercValue,
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: maxDrawdownPercValue,
    })
    // We need to wait until options be saved
    setPendingForSaveOptions(true)
  }

  useEffect(() => {
    setCapitalAllocationValue(capitalAllocation)
    setMaxDrawdownPercValue(maxDrawdownPerc)
    setStopLossPercValue(stopLossPerc)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  useEffect(() => {
    if (
      pendingForSaveOptions
      && capitalAllocation === capitalAllocationValue
      && maxDrawdownPerc === maxDrawdownPercValue
      && stopLossPerc === stopLossPercValue
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
      label={
        isPaperTrading
          ? t('strategyEditor.executionOptionsModal.title')
          : t('strategyEditor.executionOptionsModal.disabledTitle')
      }
      onSubmit={onSubmit}
    >
      {pendingForSaveOptions ? <Spinner />
        : (
          <ExecutionOptionsBody
            {...props}
            isPaperTrading={isPaperTrading}
            capitalAllocation={capitalAllocationValue}
            setCapitalAllocation={capitalAllocationHandler}
            capitalAllocationError={capitalAllocationError}
            stopLossPerc={stopLossPercValue}
            stopLossPercError={stopLossPercError}
            setStopLossPerc={stopLossPercHandler}
            maxDrawdownPerc={maxDrawdownPercValue}
            maxDrawdownError={maxDrawdownError}
            setMaxDrawdownPerc={maxDrawdownHandler}
            t={t}
          />
        )}
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
          <Modal.Button primary onClick={onSubmit} disabled={!isFullFilled || pendingForSaveOptions}>
            {t('strategyEditor.saveAndLaunchBtn')}
          </Modal.Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

ExecutionOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  capitalAllocation: PropTypes.string.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  startExecution: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  isFullFilled: PropTypes.bool.isRequired,
  strategyId: PropTypes.string.isRequired,
  startBacktest: PropTypes.func.isRequired,
  executionOptionsModalType: PropTypes.string,
}

ExecutionOptionsModal.defaultProps = {
  executionOptionsModalType: null,
}

export default ExecutionOptionsModal
