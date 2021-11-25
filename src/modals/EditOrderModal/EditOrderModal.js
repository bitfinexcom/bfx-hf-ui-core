import React, {
  memo, useState, useEffect, useRef,
} from 'react'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _isObject from 'lodash/isObject'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'
import {
  renderLayout,
  symbolToQuoteBase,
} from '../../components/OrderForm/OrderForm.helpers'
import {
  getAOs, getAtomicOrders, validateOrderLimits,
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
  const [isAO, setIsAO] = useState(false)

  useEffect(() => {
    if (!_isObject(order)) {
      return
    }

    const algoOrders = getAOs(t)
    const orders = getAtomicOrders(t)

    let uiDef = _find(orders, ({ label }) => label === order.name)
    const isAlgoOrder = !uiDef

    if (!uiDef) {
      uiDef = _find(algoOrders, ({ label }) => label === order.name)
    }
    // uiDef.fields = fixComponentContext(uiDef.fields, currentMarket)

    setIsAO(isAlgoOrder)
    setLayout(uiDef)
  }, [order])

  const onClose = () => {
    changeVisibilityState(false)
  }

  const onSubmit = () => {
    onClose()
  }

  const onFieldChange = () => {

  }

  return (
    <Modal
      label='Edit order modal'
      className='hfui-edit-order-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {_isEmpty(order) ? (
        'No order selected'
      ) : renderLayout({
        onSubmit,
        onFieldChange,
        layout,
        validationErrors: {},
        renderData: symbolToQuoteBase(order?.args?.symbol),
        isOrderExecuting: false,
        t,
        fieldData: {
          ...order?.args,
          _context: getContext(order.args?._futures, order.args?._margin),
        },
      })}
      <Modal.Footer>
        <Modal.Button onClick={onSubmit} primary>
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
