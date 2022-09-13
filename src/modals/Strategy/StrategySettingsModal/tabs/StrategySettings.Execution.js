import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@ufx-ui/core'

import { useTranslation } from 'react-i18next'
import AmountInput from '../../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../../components/OrderForm/FieldComponents/input.percent'

const ExecutionTab = ({
  isPaperTrading,
  maxDrawdownPerc,
  setMaxDrawdownPerc,
  maxDrawdownError,
  setCapitalAllocation,
  capitalAllocation,
  capitalAllocationError,
  stopLossPerc,
  stopLossPercError,
  setStopLossPerc,
  strategyQuote,
}) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-execution-options-modal'>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {t('strategyEditor.executionOptionsModal.capitalAllocationLabel')}
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('strategyEditor.capitalAllocationHelp')}
          </p>
          <AmountInput
            placeholder={t('ui.e.g.', { value: 3000.0 })}
            onChange={setCapitalAllocation}
            value={capitalAllocation}
            validationError={capitalAllocationError}
            disabled={!isPaperTrading || !strategyQuote}
            indicator={strategyQuote}
          />
        </div>
      </div>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {`${t('strategyEditor.executionOptionsModal.stopLoss')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('strategyEditor.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('strategyEditor.stopLossHelp')}
          </p>
          <PercentInput
            placeholder={t('ui.e.g.', { value: '45%' })}
            value={stopLossPerc}
            onChange={setStopLossPerc}
            disabled={!isPaperTrading}
            validationError={stopLossPercError}
            indicator='%'
          />
        </div>
      </div>
      <div className='hfui-execution-options-modal__option'>
        <p className='title'>
          {`${t('strategyEditor.executionOptionsModal.maxDrawdown')}, %`}
          <Tooltip
            className='__react-tooltip __react-tooltip-break-line'
            content={t('strategyEditor.strategyStop')}
          >
            <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
          </Tooltip>
        </p>
        <div className='hfui-execution-options-modal-selection'>
          <p>
            {t('strategyEditor.maximumDrawdownHelp')}
          </p>
          <PercentInput
            placeholder={t('ui.e.g.', { value: '45%' })}
            value={maxDrawdownPerc}
            onChange={setMaxDrawdownPerc}
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
  setStopLossPerc: PropTypes.func.isRequired,
  stopLossPercError: PropTypes.string,
  maxDrawdownPerc: PropTypes.string.isRequired,
  maxDrawdownError: PropTypes.string,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
  capitalAllocationError: PropTypes.string,
  setCapitalAllocation: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  strategyQuote: PropTypes.string,
}

ExecutionTab.defaultProps = {
  stopLossPercError: '',
  maxDrawdownError: '',
  capitalAllocationError: '',
  strategyQuote: null,
}

export default ExecutionTab
