import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@ufx-ui/core'
import Modal from '../../../ui/Modal'
import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'
import PercentInput from '../../../components/OrderForm/FieldComponents/input.percent'

import './style.scss'

const ExecutionOptionsModal = ({
  isOpen,
  onClose,
  capitalAllocation,
  setCapitalAllocation,
  stopLossPerc,
  setStopLossPerc,
  maxDrawdownPerc,
  setMaxDrawdownPerc,
  startExecution,
}) => {
  const [capitalAllocationError, setCapitalAllocationError] = useState(null)

  const { t } = useTranslation()

  const capitalAllocationHandler = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setCapitalAllocationError(error)
    if (error) {
      return
    }
    setCapitalAllocation(processed)
  }

  const isFullFilled = capitalAllocation && stopLossPerc && maxDrawdownPerc

  const onSubmit = () => {
    if (!isFullFilled) {
      return
    }
    startExecution()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('strategyEditor.executionOptionsModal.title')}
      onSubmit={onSubmit}
    >
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
            placeholder={t('ui.e.g.', { value: 12.345 })}
            onChange={capitalAllocationHandler}
            value={capitalAllocation}
            validationError={capitalAllocationError}
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
          />
        </div>
      </div>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.closeBtn')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit} disabled={!isFullFilled}>
          {t('ui.startBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

ExecutionOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  capitalAllocation: PropTypes.string.isRequired,
  setCapitalAllocation: PropTypes.func.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  setStopLossPerc: PropTypes.func.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
  startExecution: PropTypes.func.isRequired,
}

export default ExecutionOptionsModal
