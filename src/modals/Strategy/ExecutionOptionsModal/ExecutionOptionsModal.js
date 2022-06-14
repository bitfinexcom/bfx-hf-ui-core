import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import _debounce from 'lodash/debounce'
import Modal from '../../../ui/Modal'
import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../components/OrderForm/FieldComponents/input.percent'

import ExecutionOptionsBody from './ExecutionOptionsBody'
import { getIsPaperTrading } from '../../../redux/selectors/ui'
import { STRATEGY_OPTIONS_KEYS } from '../../../components/StrategyEditor/StrategyEditor.helpers'

import './style.scss'

const ExecutionOptionsModal = (props) => {
  const {
    isOpen,
    onClose,
    saveStrategyOptions,
    startExecution,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
    isFullFilled,
    strategyId,
  } = props
  const [capitalAllocationValue, setCapitalAllocationValue] = useState('')
  const [stopLossPercValue, setStopLossPercValue] = useState('')
  const [maxDrawdownPercValue, setMaxDrawdownPercValue] = useState('')

  const [capitalAllocationError, setCapitalAllocationError] = useState('')
  const [stopLossPercError, setStopLossError] = useState('')
  const [maxDrawdownError, setMaxDrawdownError] = useState('')

  const isPaperTrading = useSelector(getIsPaperTrading)

  const { t } = useTranslation()

  const setCapitalAllocation = useCallback(
    _debounce(
      (value) => saveStrategyOptions({
        [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: value,
      }),
      500,
    ),
    [saveStrategyOptions],
  )
  const setStopLossPerc = useCallback(
    _debounce(
      (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.STOP_LESS_PERC]: value }),
      500,
    ),
    [saveStrategyOptions],
  )

  const setMaxDrawdownPerc = useCallback(
    _debounce(
      (value) => saveStrategyOptions({
        [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: value,
      }),
      500,
    ),
    [saveStrategyOptions],
  )

  const capitalAllocationHandler = useCallback((v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setCapitalAllocationError(error)
    setCapitalAllocationValue(v)

    setCapitalAllocation(processed)
  }, [setCapitalAllocation, t])

  const stopLossPercHandler = useCallback((v) => {
    const error = PercentInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setStopLossError(error)
    setStopLossPercValue(v)
    if (error) {
      return
    }
    setStopLossPerc(processed)
  }, [setStopLossPerc, t])

  const maxDrawdownHandler = useCallback((v) => {
    const error = PercentInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    setMaxDrawdownError(error)
    setMaxDrawdownPercValue(v)
    if (error) {
      return
    }
    setMaxDrawdownPerc(processed)
  }, [setMaxDrawdownPerc, t])

  const onSubmit = useCallback(() => {
    if (!isFullFilled) {
      return
    }
    onClose()
    startExecution()
  }, [isFullFilled, onClose, startExecution])

  useEffect(() => {
    setCapitalAllocationValue(capitalAllocation)
    setMaxDrawdownPercValue(maxDrawdownPerc)
    setStopLossPercValue(stopLossPerc)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

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
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.closeBtn')}
        </Modal.Button>
        {isPaperTrading && (
          <Modal.Button primary onClick={onSubmit} disabled={!isFullFilled}>
            {t('ui.startBtn')}
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
}

export default ExecutionOptionsModal
