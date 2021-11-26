import React, {
  memo, useState, useEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _isObject from 'lodash/isObject'
import _isEmpty from 'lodash/isEmpty'
import _isBoolean from 'lodash/isBoolean'
import _isString from 'lodash/isString'
import _toLower from 'lodash/toLower'
import _replace from 'lodash/replace'
import _trim from 'lodash/trim'

import Modal from '../../ui/Modal'
import {
  renderLayout, symbolToQuoteBase, COMPONENTS_FOR_ID,
} from '../../components/OrderForm/OrderForm.helpers'
import {
  getAOs, getAtomicOrders,
} from '../../components/OrderForm/OrderForm.orders.helpers'
import '../../components/OrderForm/style.css'
import './style.css'

const getContext = (_futures, _margin) => {
  return _futures ? 'f' : _margin ? 'm' : 'e'
}

const EditOrderModal = ({
  changeVisibilityState, visible, order,
}) => {
  const { t } = useTranslation()
  const [layout, setLayout] = useState({})
  const [args, setArgs] = useState({})
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!_isObject(order)) {
      return
    }
    const updOrder = { ...order }
    let isAlgoOrder = true
    const algoOrders = getAOs(t)
    const orders = getAtomicOrders(t)
    let uiDef = _find(algoOrders, ({ label }) => label === updOrder.name)

    if (!uiDef) {
      const processedType = _replace(_toLower(updOrder.type), /(exchange )/i, '')
      uiDef = _find(orders, ({ label }) => _toLower(label) === processedType)
      isAlgoOrder = false
    }
    // uiDef.fields = fixComponentContext(uiDef.fields, currentMarket)

    if (!uiDef) {
      return
    }

    if (!isAlgoOrder) {
      console.log(uiDef)
      uiDef.action = updOrder.amount < 0 ? 'sell' : 'buy'
      updOrder.amount = Math.abs(updOrder.amount)
    }

    setArgs(isAlgoOrder ? order.args : updOrder)
    setLayout(uiDef)
    console.log(updOrder)
  }, [order, t])

  const onClose = () => {
    changeVisibilityState(false)
  }

  const onSubmit = (action) => {
    setLayout({
      ...layout,
      action,
    })
  }

  const onFieldChange = (key, value) => {
    const { fields = {} } = layout
    const field = fields[key] || {}
    const { disabled } = field

    if (_isBoolean(disabled) && disabled) {
      return null
    }

    const { component } = field
    const C = COMPONENTS_FOR_ID[component]
    let processedValue = value

    if (_isString(value)) {
      processedValue = _trim(value)
    }

    const validationError = (C && C.validateValue)
      ? C.validateValue(processedValue)
      : null

    setValidationErrors({
      ...validationErrors,
      [key]: validationError,
    })
    setArgs({
      ...args,
      [key]: processedValue,
    })

    return true
  }

  return (
    <Modal
      label='Edit order modal'
      className='hfui-edit-order-modal__wrapper'
      isOpen={visible}
      onSubmit={onClose}
    >
      {_isEmpty(order) ? (
        'No order selected'
      ) : renderLayout({
        onSubmit,
        onFieldChange,
        layout,
        validationErrors,
        renderData: symbolToQuoteBase(order?.args?.symbol),
        isOrderExecuting: false,
        t,
        fieldData: {
          ...args,
          _context: getContext(order.args?._futures, order.args?._margin),
        },
      })}
      <Modal.Footer>
        <Modal.Button onClick={onClose} primary>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

EditOrderModal.propTypes = {
  changeVisibilityState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  order: PropTypes.object.isRequired, // eslint-disable-line
}

export default memo(EditOrderModal)
