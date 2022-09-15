import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@ufx-ui/core'

import { useTranslation } from 'react-i18next'
import AmountInput from '../../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../../components/OrderForm/FieldComponents/input.percent'

const ExecutionTab = ({
  isPaperTrading,
  maxDrawdownPerc,
  setCapitalAllocationValue,
  setStopLossPercValue,
  setMaxDrawdownPercValue,
  capitalAllocation,
  stopLossPerc,
  strategyQuote,
}) => {
  const [capitalAllocationError, setCapitalAllocationError] = useState('')
  const [stopLossPercError, setStopLossError] = useState('')
  const [maxDrawdownError, setMaxDrawdownError] = useState('')
  const { t } = useTranslation()

  const capitalAllocationHandler = (v) => {
    const error = AmountInput.validateValue(v, t)

    setCapitalAllocationError(error)
    setCapitalAllocationValue(v)
  }

  const stopLossPercHandler = (v) => {
    const error = AmountInput.validateValue(v, t)

    setStopLossError(error)
    setStopLossPercValue(v)
  }

  const maxDrawdownHandler = (v) => {
    const error = AmountInput.validateValue(v, t)

    setMaxDrawdownError(error)
    setMaxDrawdownPercValue(v)
  }

  useEffect(() => {
    if (strategyQuote) {
      setCapitalAllocationError('')
    } else {
      setCapitalAllocationError(t('executionOptionsModal.noMarketSelected'))
    }
  }, [strategyQuote, t])

  return (
    <div className='hfui-execution-options-modal'>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {t('executionOptionsModal.capitalAllocationLabel')}
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('executionOptionsModal.capitalAllocationHelp')}
          </p>
          <AmountInput
            placeholder={t('ui.e.g.', { value: 3000.0 })}
            onChange={capitalAllocationHandler}
            value={capitalAllocation}
            validationError={capitalAllocationError}
            disabled={!isPaperTrading || !strategyQuote}
            indicator={strategyQuote}
          />
        </div>
      </div>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {`${t('executionOptionsModal.stopLoss')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('executionOptionsModal.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('executionOptionsModal.stopLossHelp')}
          </p>
          <PercentInput
            placeholder={t('ui.e.g.', { value: '45%' })}
            value={stopLossPerc}
            onChange={stopLossPercHandler}
            disabled={!isPaperTrading}
            validationError={stopLossPercError}
            indicator='%'
          />
        </div>
      </div>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {`${t('executionOptionsModal.maxDrawdown')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('executionOptionsModal.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('executionOptionsModal.maximumDrawdownHelp')}
          </p>
          <PercentInput
            placeholder={t('ui.e.g.', { value: '45%' })}
            value={maxDrawdownPerc}
            onChange={maxDrawdownHandler}
            disabled={!isPaperTrading}
            validationError={maxDrawdownError}
            indicator='%'
          />
        </div>
      </div>
    </div>
  )
}

ExecutionTab.propTypes = {
  capitalAllocation: PropTypes.string.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  setCapitalAllocationValue: PropTypes.func.isRequired,
  setStopLossPercValue: PropTypes.func.isRequired,
  setMaxDrawdownPercValue: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  strategyQuote: PropTypes.string,
}

ExecutionTab.defaultProps = {
  strategyQuote: null,
}

export default ExecutionTab
