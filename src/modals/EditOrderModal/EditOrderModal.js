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
import _values from 'lodash/values'
import _some from 'lodash/some'
import _trim from 'lodash/trim'

import Modal from '../../ui/Modal'
import {
  renderLayout, symbolToQuoteBase, COMPONENTS_FOR_ID, processFieldData, validateAOData,
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
  changeVisibilityState, visible, order, updateOrder, authToken, atomicOrdersCount, countFilterAtomicOrdersByMarket,
  maxOrderCounts, gaEditAO, cancelAlgoOrder, submitAlgoOrder,
}) => {
  const { t } = useTranslation()
  const [layout, setLayout] = useState({})
  const [args, setArgs] = useState({})
  const [validationErrors, setValidationErrors] = useState({})
  const [isAO, setIsAO] = useState(true)
  const hasError = _some(_values(validationErrors), _isString)

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

    if (!uiDef) {
      return
    }

    if (!isAlgoOrder) {
      uiDef.action = updOrder.amount < 0 ? 'sell' : 'buy'
      updOrder.amount = Math.abs(updOrder.amount)
    }

    setArgs(isAlgoOrder ? order.args : updOrder)
    setLayout(uiDef)
    setIsAO(isAlgoOrder)
  }, [order, t])

  const onClose = () => {
    changeVisibilityState(false)
  }

  const onOrderSubmit = (action) => {
    setLayout({
      ...layout,
      action,
    })
  }

  const onSubmitAO = () => {
    const market = { wsID: args?.symbol }
    const activeMarketCount = countFilterAtomicOrdersByMarket(market)
    const data = processFieldData({
      layout,
      fieldData: args,
      action: 'submit',
    })
    const error = validateAOData(data, layout, market, atomicOrdersCount, activeMarketCount, maxOrderCounts)

    if (_isEmpty(error)) {
      const { symbol, _futures, _margin } = args
      gaEditAO()
      cancelAlgoOrder(authToken, order.gid)
      submitAlgoOrder(authToken, layout.id, symbol, _futures, _margin, data)
      onClose()
    } else {
      const { field, message, i18n } = error
      setValidationErrors({
        ...validationErrors,
        [field]: i18n ? t(`algoOrderForm.validationMessages.${i18n.key}`, i18n.props) : message,
      })
    }
  }

  const onSubmit = () => {
    if (hasError) {
      return
    }

    if (isAO) {
      onSubmitAO()
      return
    }

    const { generateOrder } = layout
    const data = processFieldData({
      layout,
      fieldData: args,
      action: layout.action,
    })
    const generated = generateOrder(data, data.symbol, getContext(order.args?._futures, order.args?._margin))

    updateOrder(authToken, generated)
    onClose()
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
      [key]: validationError,
    })
    setArgs({
      ...args,
      [key]: processedValue,
    })

    return true
  }

  console.log(layout, args)
  return (
    <Modal
      label={t('editOrderModal.title')}
      className='hfui-edit-order-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {_isEmpty(order) ? (
        t('editOrderModal.noOrder')
      ) : renderLayout({
        onSubmit: onOrderSubmit,
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
        <Modal.Button onClick={onClose} secondary>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button onClick={onSubmit} disabled={hasError} primary>
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
  updateOrder: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  atomicOrdersCount: PropTypes.number.isRequired,
  countFilterAtomicOrdersByMarket: PropTypes.func.isRequired,
  maxOrderCounts: PropTypes.objectOf(PropTypes.number).isRequired,
  gaEditAO: PropTypes.func.isRequired,
  cancelAlgoOrder: PropTypes.func.isRequired,
  submitAlgoOrder: PropTypes.func.isRequired,
}

export default memo(EditOrderModal)
