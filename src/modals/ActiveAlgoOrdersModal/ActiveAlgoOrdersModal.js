import React, { useState, useCallback } from 'react'
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
}) => {
  const { t } = useTranslation()
  const [selectedOrders, setSelectedOrders] = useState([])

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
      _forEach(activeAlgoOrders, order => {
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
    _forEach(activeAlgoOrders, order => {
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

  const onSubmit = useCallback((type) => {
    const ordersLeft = _differenceBy(activeAlgoOrders, selectedOrders, 'gid')
    const allOrders = prepareOrders(activeAlgoOrders)
    const unselectedOrders = prepareOrders(ordersLeft)
    handleActiveOrders({
      type,
      allOrders,
      selectedOrders,
      unselectedOrders,
    })
  }, [handleActiveOrders, activeAlgoOrders, selectedOrders])

  const onResumeButtonClickHandler = useCallback(() => {
    if (_isEmpty(selectedOrders)) {
      return
    }
    onSubmit('resume')
  }, [selectedOrders, onSubmit])

  const cancellOrders = useCallback(() => onSubmit('cancel_all'),
    [onSubmit])

  return (
    <Modal
      isOpen={isOpen}
      onClose={cancellOrders}
      onSubmit={onResumeButtonClickHandler}
      label={t('activeAlgoOrdersModal.title')}
      className='hfui-active-ao-modal__wrapper'
      width={800}
    >
      <AlgoOrdersTable
        orders={activeAlgoOrders}
        onOrderSelect={onOrderSelect}
        onAllOrdersSelect={onAllOrdersSelect}
        isOrderSelected={isOrderSelected}
        isAllOrdersSelected={isAllOrdersSelected}
      />
      <Modal.Footer>
        <Modal.Button
          primary
          onClick={cancellOrders}
          className='hfui-active-ao-modal-btn mr-10'
        >
          {t('activeAlgoOrdersModal.cancellBtn')}
        </Modal.Button>
        <Modal.Button
          primary
          onClick={onResumeButtonClickHandler}
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
  isOpen: PropTypes.bool.isRequired,
}

ActiveAlgoOrdersModal.defaultProps = {
  activeAlgoOrders: [],
}

export default React.memo(ActiveAlgoOrdersModal)
