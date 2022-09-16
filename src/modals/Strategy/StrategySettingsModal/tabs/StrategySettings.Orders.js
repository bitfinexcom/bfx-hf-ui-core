/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'
import AttentionBar from '../../../../ui/AttentionBar/AttentionBar'
import { STOP_ORDER_ARTICLE_URL } from '../../../../redux/config'
import AmountInput from '../../../../components/OrderForm/FieldComponents/input.amount'

const OrdersTab = ({
  additionStopOrder,
  setAdditionStopOrder,
  setStopOrderValue,
  stopOrderValue,
  isPairSelected,
}) => {
  const [stopOrderValueError, setStopOrderValueError] = useState('')
  const { t } = useTranslation()

  const stopOrderValueHandler = (v) => {
    const error = AmountInput.validateValue(v, t)

    setStopOrderValueError(error)
    setStopOrderValue(v)
  }

  return (
    <div className='hfui-execution-options-modal'>
      {!isPairSelected && (
        <AttentionBar className='hfui-execution-options-modal__option' red>
          {t('executionOptionsModal.noSelectedPairWarning')}
        </AttentionBar>
      )}
      <div className='hfui-execution-options-modal__option'>
        <Checkbox
          onChange={setAdditionStopOrder}
          label={t('executionOptionsModal.additionStopOrderCheckbox')}
          checked={additionStopOrder}
          disabled={!isPairSelected}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          <Trans
            t={t}
            i18nKey='executionOptionsModal.additionStopOrderCheckboxDescription'
            components={{
              url: (
                <a
                  href={STOP_ORDER_ARTICLE_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                />
              ),
            }}
          />
        </div>
      </div>
      <div className='hfui-execution-options-modal__option hfui-execution-options-modal__stop-order-input'>
        <AmountInput
          className='hfui-execution-options-modal__amount'
          onChange={stopOrderValueHandler}
          validationError={stopOrderValueError}
          value={stopOrderValue}
          min={0}
          max={99}
          disabled={!additionStopOrder || !isPairSelected}
        />
        <p className='hfui-execution-options-modal__right-placeholder'>
          {t('executionOptionsModal.stopOrderValuePlaceholder')}
        </p>
      </div>
    </div>
  )
}

OrdersTab.propTypes = {
  additionStopOrder: PropTypes.bool.isRequired,
  setAdditionStopOrder: PropTypes.func.isRequired,
  setStopOrderValue: PropTypes.func.isRequired,
  stopOrderValue: PropTypes.string.isRequired,
  isPairSelected: PropTypes.bool.isRequired,
}

export default OrdersTab
