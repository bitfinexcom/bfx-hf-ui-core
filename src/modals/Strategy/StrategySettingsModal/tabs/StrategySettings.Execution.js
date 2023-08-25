import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import AmountInput from '../../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../../components/OrderForm/FieldComponents/input.percent'
import { MARKET_SHAPE } from '../../../../constants/prop-types-shapes'

const { getCurrencySymbolMemo } = reduxSelectors

const ExecutionTab = ({
  isPaperTrading,
  maxDrawdownPerc,
  setCapitalAllocationValue,
  setStopLossPercValue,
  setMaxDrawdownPercValue,
  capitalAllocation,
  stopLossPerc,
  symbol,
}) => {
  const [capitalAllocationError, setCapitalAllocationError] = useState('')
  const [stopLossPercError, setStopLossError] = useState('')
  const [maxDrawdownError, setMaxDrawdownError] = useState('')
  const { t } = useTranslation()

  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)

  const strategyQuote = !_isEmpty(symbol) && getCurrencySymbol(symbol?.quote)

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
      setCapitalAllocationError(t('strategySettingsModal.noMarketSelected'))
    }
  }, [strategyQuote, t])

  return (
    <div className='hfui-execution-options-modal'>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {t('strategySettingsModal.capitalAllocationLabel')}
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>{t('strategySettingsModal.capitalAllocationHelp')}</p>
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
          {`${t('strategySettingsModal.stopLoss')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('strategySettingsModal.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>{t('strategySettingsModal.stopLossHelp')}</p>
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
          {`${t('strategySettingsModal.maxDrawdown')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('strategySettingsModal.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>{t('strategySettingsModal.maximumDrawdownHelp')}</p>
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
  capitalAllocation: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  stopLossPerc: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  maxDrawdownPerc: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setCapitalAllocationValue: PropTypes.func.isRequired,
  setStopLossPercValue: PropTypes.func.isRequired,
  setMaxDrawdownPercValue: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  symbol: PropTypes.shape(MARKET_SHAPE),
}

ExecutionTab.defaultProps = {
  symbol: null,
}

export default ExecutionTab
