import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@ufx-ui/core'

import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../components/OrderForm/FieldComponents/input.percent'

const ExecutionOptionsBody = ({
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
  t,
}) => (
  <div className='hfui-execution-options-modal'>
    <div className='hfui-execution-options-modal__option'>
      <p className='title'>
        {t('strategyEditor.executionOptionsModal.capitalAllocationLabel')}
        <Tooltip
          className='__react-tooltip __react-tooltip-break-line'
          content={t('strategyEditor.capitalAllocationHelp')}
        >
          <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
        </Tooltip>
      </p>
      <AmountInput
        placeholder={t('ui.e.g.', { value: 3000.0 })}
        onChange={setCapitalAllocation}
        value={capitalAllocation}
        validationError={capitalAllocationError}
        disabled={!isPaperTrading}
      />
    </div>
    <div className='hfui-execution-options-modal__option'>
      <p className='title'>
        {`${t('strategyEditor.executionOptionsModal.stopLoss')}, %`}
        <Tooltip
          className='__react-tooltip __react-tooltip-break-line'
          content={t('strategyEditor.stopLossHelp')}
        >
          <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
        </Tooltip>
      </p>
      <PercentInput
        placeholder={t('ui.e.g.', { value: '45%' })}
        value={stopLossPerc}
        onChange={setStopLossPerc}
        disabled={!isPaperTrading}
        validationError={stopLossPercError}
      />
    </div>
    <div className='hfui-execution-options-modal__option'>
      <p className='title'>
        {`${t('strategyEditor.executionOptionsModal.maxDrawdown')}, %`}
        <Tooltip
          className='__react-tooltip __react-tooltip-break-line'
          content={t('strategyEditor.maximumDrawdownHelp')}
        >
          <i className='fa fa-info-circle __react_component_tooltip title-tooltip' />
        </Tooltip>
      </p>
      <PercentInput
        placeholder={t('ui.e.g.', { value: '45%' })}
        value={maxDrawdownPerc}
        onChange={setMaxDrawdownPerc}
        disabled={!isPaperTrading}
        validationError={maxDrawdownError}
      />
    </div>
  </div>
)

ExecutionOptionsBody.propTypes = {
  capitalAllocation: PropTypes.string.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  setStopLossPerc: PropTypes.func.isRequired,
  stopLossPercError: PropTypes.string,
  maxDrawdownPerc: PropTypes.string.isRequired,
  maxDrawdownError: PropTypes.string,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
  capitalAllocationError: PropTypes.string,
  setCapitalAllocation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
}

ExecutionOptionsBody.defaultProps = {
  stopLossPercError: '',
  maxDrawdownError: '',
  capitalAllocationError: '',
}

export default ExecutionOptionsBody
