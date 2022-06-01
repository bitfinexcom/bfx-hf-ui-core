import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '../../../ui/Modal'
import AmountInput from '../../../components/OrderForm/FieldComponents/input.amount'

import ExecutionOptionsBody from './ExecutionOptionsBody'
import { getIsPaperTrading } from '../../../redux/selectors/ui'

import './style.scss'

const ExecutionOptionsModal = (props) => {
  const {
    isOpen,
    onClose,
    capitalAllocation,
    setCapitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
    startExecution,
  } = props
  const [capitalAllocationError, setCapitalAllocationError] = useState('')
  const isPaperTrading = useSelector(getIsPaperTrading)

  const { t } = useTranslation()

  const capitalAllocationHandler = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = String(AmountInput.processValue(v))

    if (error) {
      setCapitalAllocationError(error)
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
      label={
        isPaperTrading
          ? t('strategyEditor.executionOptionsModal.title')
          : t('strategyEditor.executionOptionsModal.disabledTitle')
      }
      onSubmit={onSubmit}
    >
      <ExecutionOptionsBody
        isPaperTrading={isPaperTrading}
        capitalAllocationHandler={capitalAllocationHandler}
        capitalAllocationError={capitalAllocationError}
        t={t}
        {...props}
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
  setCapitalAllocation: PropTypes.func.isRequired,
  stopLossPerc: PropTypes.string.isRequired,
  setStopLossPerc: PropTypes.func.isRequired,
  maxDrawdownPerc: PropTypes.string.isRequired,
  setMaxDrawdownPerc: PropTypes.func.isRequired,
  startExecution: PropTypes.func.isRequired,
}

export default ExecutionOptionsModal
