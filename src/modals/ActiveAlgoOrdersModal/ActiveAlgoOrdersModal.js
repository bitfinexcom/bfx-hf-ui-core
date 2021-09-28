import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _differenceBy from 'lodash/differenceBy'
import _filter from 'lodash/filter'
import _includes from 'lodash/includes'
import _forEach from 'lodash/forEach'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'

import AlgoOrdersTable from './ActiveAlgoOrdersModal.table'

import './style.css'

const ActiveAlgoOrdersModal = ({
  isOpen,
  activeAlgoOrders,
  handleActiveOrders,
  showActiveOrdersModal,
}) => {
  const [ordersList, setOrdersList] = useState([])
  const [selectedOrders, setSelectedOrders] = useState([])

  useEffect(() => {
    setOrdersList(activeAlgoOrders)
  }, [])

  const onOrderSelect = (e, gid, algoID) => {
    if (e) {
      setSelectedOrders([...selectedOrders, { gid, algoID }])
    } else {
      setSelectedOrders(_filter(selectedOrders, order => gid !== order.gid))
    }
  }

  const onAllOrdersSelect = (e) => {
    let allOrders = []
    if (e) {
      _forEach(ordersList, order => {
        const { gid, algoID } = order
        allOrders.push({ gid, algoID })
      })
    } else {
      allOrders = []
    }
    setSelectedOrders(allOrders)
  }

  const isOrderSelected = (gid) => {
    const gids = []
    _forEach(selectedOrders, order => gids.push(order.gid))
    return _includes(gids, gid)
  }

  const isAllOrdersSelected = () => {
    const allOrders = []
    _forEach(ordersList, order => {
      const { gid, algoID } = order
      allOrders.push({ gid, algoID })
    })
    return _isEqual(allOrders, selectedOrders)
  }

  const prepareOrders = (orders) => {
    const preparedOrders = []
    _forEach(orders, order => {
      const { gid, algoID } = order
      preparedOrders.push({ gid, algoID })
    })
    return preparedOrders
  }

  const onSubmit = (type) => {
    const ordersLeft = _differenceBy(ordersList, selectedOrders, 'gid')
    const allOrders = prepareOrders(ordersList)
    const unselectedOrders = prepareOrders(ordersLeft)
    handleActiveOrders({
      type,
      allOrders,
      selectedOrders,
      unselectedOrders,
    })
  }

  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        showActiveOrdersModal(false)
        onSubmit('cancel_all')
      }}
      label={t('activeAlgoOrdersModal.title')}
      className='hfui-active-ao-modal__wrapper'
      width={800}
    >
      <AlgoOrdersTable
        orders={ordersList}
        onOrderSelect={onOrderSelect}
        onAllOrdersSelect={onAllOrdersSelect}
        isOrderSelected={isOrderSelected}
        isAllOrdersSelected={isAllOrdersSelected}
      />
      <Modal.Footer>
        <Modal.Button
          primary
          onClick={() => onSubmit('cancel_all')}
          className='hfui-active-ao-modal-btn mr-10'
        >
          {t('activeAlgoOrdersModal.cancellBtn')}
        </Modal.Button>
        <Modal.Button
          primary
          onClick={() => onSubmit('resume')}
          disabled={_isEmpty(selectedOrders)}
          className='hfui-active-ao-modal-btn'
        >
          {t('activeAlgoOrdersModal.resumeBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

ActiveAlgoOrdersModal.propTypes = {
  handleActiveOrders: PropTypes.func.isRequired,
  activeAlgoOrders: PropTypes.arrayOf(PropTypes.object),
  showActiveOrdersModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

ActiveAlgoOrdersModal.defaultProps = {
  activeAlgoOrders: [],
}

export default React.memo(ActiveAlgoOrdersModal)
