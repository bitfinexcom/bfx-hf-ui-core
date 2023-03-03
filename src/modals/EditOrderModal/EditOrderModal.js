import React, { memo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _isObject from 'lodash/isObject'
import _isEmpty from 'lodash/isEmpty'
import _isBoolean from 'lodash/isBoolean'
import _toNumber from 'lodash/toNumber'
import _isString from 'lodash/isString'
import _toLower from 'lodash/toLower'
import _replace from 'lodash/replace'
import _toString from 'lodash/toString'
import _keys from 'lodash/keys'
import _includes from 'lodash/includes'
import _reduce from 'lodash/reduce'
import _values from 'lodash/values'
import _some from 'lodash/some'
import _trim from 'lodash/trim'
import { Recurring } from 'bfx-hf-algo'

import Modal from '../../ui/Modal'
import {
  renderLayout,
  symbolToQuoteBase,
  COMPONENTS_FOR_ID,
  processFieldData,
  validateAOData,
} from '../../components/OrderForm/OrderForm.helpers'
import {
  getAOs,
  getAtomicOrders,
} from '../../components/OrderForm/OrderForm.orders.helpers'
import { MARKET_SHAPE, ORDER_SHAPE } from '../../constants/prop-types-shapes'
import { getCurrencyDefinition } from '../../components/OrderForm/FieldComponents/fields.helpers'
import DiscardAOEdit from '../DiscardAOEdit'

import '../../components/OrderForm/style.css'
import './style.css'

const getContext = (symbol, markets) => {
  const market = markets[symbol]

  if (_includes(market?.contexts, 'f')) {
    return 'f'
  }

  return 'e'
}

const flagsMapping = {
  hidden: 64,
  close: 512,
  reduceonly: 1024,
  postonly: 4096,
  oco: 16384,
}

const calculateFlags = (order) => {
  const flags = _keys(flagsMapping)
  return _reduce(
    flags,
    (prev, curr) => {
      return order[curr] ? prev + flagsMapping[curr] : prev
    },
    0,
  )
}

const processUpdateOrder = (order, id) => ({
  ...order,
  id,
  amount: _toString(order.amount),
  price: order.price && _toString(order.price),
  price_trailing: order.priceTrailing && _toString(order.priceTrailing),
  price_aux_limit: order.priceAuxLimit && _toString(order.priceAuxLimit),
  meta: {
    make_visible: _toNumber(order.visibleOnHit),
  },
  flags: calculateFlags(order),
})

const processAOArgs = (args) => {
  const updArgs = { ...args }
  updArgs.amount = Math.abs(updArgs.amount)

  if (!updArgs.action) {
    updArgs.action = updArgs.amount < 0 ? 'sell' : 'buy'
  }

  if (_isString(updArgs.startedAt)) {
    updArgs.startedAt = new Date(updArgs.startedAt)
  }
  if (_isString(updArgs.endedAt)) {
    updArgs.endedAt = new Date(updArgs.endedAt)
  }

  if (updArgs.currency) {
    updArgs.currency = getCurrencyDefinition(updArgs.currency, updArgs.symbol)
  }

  if (updArgs.sliceAmount) {
    updArgs.sliceAmount = Math.abs(updArgs.sliceAmount)
  }

  return updArgs
}

const EditOrderModal = ({
  changeVisibilityState,
  visible,
  order,
  updateOrder,
  authToken,
  atomicOrdersCount,
  countFilterAtomicOrdersByMarket,
  maxOrderCounts,
  gaEditAO,
  cancelAlgoOrder,
  submitAlgoOrder,
  markets,
  updateRecurringAO,
}) => {
  const { t } = useTranslation()
  const [layout, setLayout] = useState({})
  const [args, setArgs] = useState({})
  const [validationErrors, setValidationErrors] = useState({})
  const [madeChanges, setMadeChanges] = useState(false)
  const [discardConfirmationVisible, setDiscardConfirmationVisible] = useState(false)
  const [isAO, setIsAO] = useState(true)
  const hasError = _some(_values(validationErrors), _isString)

  useEffect(() => {
    if (!_isObject(order)) {
      return
    }
    const updOrder = { ...order }
    const algoOrders = getAOs(t, true, true)
    let isAlgoOrder = true
    let uiDef = _find(algoOrders, ({ id }) => id === updOrder.id)

    if (!uiDef) {
      const orders = getAtomicOrders(t)
      const processedType = _replace(
        _toLower(updOrder.type),
        /(exchange )/i,
        '',
      )
      uiDef = _find(orders, ({ id }) => id === processedType)
      isAlgoOrder = false
    }

    if (!uiDef) {
      return
    }

    if (isAlgoOrder) {
      updOrder.args = processAOArgs(updOrder.args)
      updOrder.args.alias = updOrder.alias
    } else {
      uiDef.action = updOrder.amount < 0 ? 'sell' : 'buy'
      updOrder.amount = Math.abs(updOrder.amount)
    }
    setArgs(isAlgoOrder ? updOrder.args : updOrder)
    setLayout(uiDef)
    setIsAO(isAlgoOrder)
  }, [order, t])

  const forcedClose = () => {
    changeVisibilityState(false)
    setMadeChanges(false)
    setDiscardConfirmationVisible(false)

    // setTimeout(() => { // clearing order data after modal close amination ends
    //   setLayout({})
    //   setArgs({})
    // }, 600)
  }

  const onClose = () => {
    if (madeChanges) {
      setDiscardConfirmationVisible(true)
      return
    }

    forcedClose()
  }

  const onSubmitAO = () => {
    const { symbol, _futures, _margin } = args
    const { id, gid } = order
    const market = { wsID: symbol }

    const activeMarketCount = countFilterAtomicOrdersByMarket(market)
    let data = processFieldData({
      layout,
      fieldData: args,
      action: 'submit',
    })

    if (id === Recurring.id) {
      data = Recurring.meta.processParams(data, markets[symbol])
    }
    const error = validateAOData(
      data,
      layout,
      market,
      atomicOrdersCount,
      activeMarketCount,
      maxOrderCounts,
    )

    if (_isEmpty(error)) {
      gaEditAO()
      const orderData = {
        ...data,
        _symbol: symbol,
      }

      if (id === Recurring.id) {
        delete orderData.symbol

        updateRecurringAO(authToken, order.gid, orderData)
      } else {
        orderData._futures = _futures
        orderData._margin = _margin

        cancelAlgoOrder(authToken, gid)
        submitAlgoOrder(authToken, id, gid, orderData)
      }

      onClose()
    } else {
      const { field, message, i18n } = error
      setValidationErrors({
        ...validationErrors,
        [field]: i18n
          ? t(`algoOrderForm.validationMessages.${i18n.key}`, i18n.props)
          : message,
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

    const generated = generateOrder(
      data,
      data.symbol,
      getContext(data.symbol, markets),
    )
    const processed = processUpdateOrder(generated, order.id)

    updateOrder(authToken, processed)
    onClose()
    setMadeChanges(false)
  }

  const onFieldChange = (key, value) => {
    const { fields = {} } = layout
    const field = fields[key] || {}
    const { disabled, avoidTrimming = false } = field

    if (_isBoolean(disabled) && disabled) {
      return null
    }

    const { component } = field
    const C = COMPONENTS_FOR_ID[component]
    let processedValue = value

    if (_isString(value) && !avoidTrimming) {
      processedValue = _trim(value)
    }

    const validationError = C && C.validateValue ? C.validateValue(processedValue, t) : null

    setValidationErrors({
      [key]: validationError,
    })
    setArgs({
      ...args,
      [key]: processedValue,
    })
    setMadeChanges(true)

    return true
  }

  return (
    <Modal
      label={t('editOrderModal.title')}
      className='hfui-edit-order-modal__wrapper hfui-orderform__panel'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className='hfui-orderform__wrapper'>
        {_isEmpty(args)
          ? t('editOrderModal.noOrder')
          : renderLayout({
            onSubmit: () => {},
            onFieldChange,
            layout,
            validationErrors,
            renderData: symbolToQuoteBase(args?.symbol),
            isOrderExecuting: false,
            t,
            fieldData: {
              ...args,
              _orderEditing: true,
              _context: getContext(args?.symbol, markets),
            },
          })}
      </div>
      <Modal.Footer>
        <Modal.Button onClick={onSubmit} disabled={hasError} primary>
          {t('ui.updateAndRestart')}
        </Modal.Button>
      </Modal.Footer>
      <DiscardAOEdit
        onSubmit={forcedClose}
        onClose={() => setDiscardConfirmationVisible(false)}
        visible={discardConfirmationVisible}
      />
    </Modal>
  )
}

EditOrderModal.propTypes = {
  changeVisibilityState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  order: PropTypes.shape(ORDER_SHAPE).isRequired,
  updateOrder: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  atomicOrdersCount: PropTypes.number.isRequired,
  countFilterAtomicOrdersByMarket: PropTypes.func.isRequired,
  maxOrderCounts: PropTypes.objectOf(PropTypes.number).isRequired,
  gaEditAO: PropTypes.func.isRequired,
  cancelAlgoOrder: PropTypes.func.isRequired,
  submitAlgoOrder: PropTypes.func.isRequired,
  markets: PropTypes.objectOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  updateRecurringAO: PropTypes.func.isRequired,
}

export default memo(EditOrderModal)
