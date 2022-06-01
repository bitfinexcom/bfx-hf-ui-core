import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@ufx-ui/core'

import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../components/OrderForm/FieldComponents/input.percent'

const ExecutionOptionsBody = ({
  isPaperTrading,
  maxDrawdownPerc,
  setMaxDrawdownPerc,
  capitalAllocationHandler,
  capitalAllocation,
  capitalAllocationError,
  stopLossPerc,
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
        onChange={capitalAllocationHandler}
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
      />
    </div>
  </div>
)

ExecutionOptionsBody.propTypes = {
  capitalAllocation: PropTypes.string.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  setStopLossPerc: PropTypes.func.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
  capitalAllocationError: PropTypes.string.isRequired,
  capitalAllocationHandler: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
}

export default ExecutionOptionsBody
