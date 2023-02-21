import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _differenceBy from 'lodash/differenceBy'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@ufx-ui/core'
import Modal from '../../ui/Modal'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'
import AlgoOrdersTable from './ActiveAlgoOrdersModal.table'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const ActiveAlgoOrdersModal = ({
  isOpen,
  activeAlgoOrders,
  handleActiveOrders,
  isAfterLogin,
}) => {
  const { t } = useTranslation()
  const [selectedPaperOrders, setSelectedPaperOrders] = useState([])
  const [selectedMainOrders, setSelectedMainOrders] = useState([])

  const noOrdersSelected = _isEmpty(selectedMainOrders) && _isEmpty(selectedPaperOrders)

  const mapOrders = useCallback((orders) => {
    return _map(orders, (order) => {
      const { gid, algoID } = order
      return { gid, algoID }
    })
  }, [])

  const onAllOrdersSelect = (e) => {
    const mainMappedOrders = e ? mapOrders(activeAlgoOrders.main) : []
    const paperMappedOrders = e ? mapOrders(activeAlgoOrders.paper) : []

    setSelectedMainOrders(mainMappedOrders)
    setSelectedPaperOrders(paperMappedOrders)
  }

  const isAllOrdersSelected = () => {
    const mainMappedOrders = mapOrders(activeAlgoOrders.main)
    const paperMappedOrders = mapOrders(activeAlgoOrders.paper)

    return (
      _isEqual(mainMappedOrders, selectedMainOrders)
      && _isEqual(paperMappedOrders, selectedPaperOrders)
    )
  }

  const onSubmit = useCallback(
    (type) => {
      const mainOrdersLeft = _differenceBy(
        activeAlgoOrders.main,
        selectedMainOrders,
        'gid',
      )
      const paperOrdersLeft = _differenceBy(
        activeAlgoOrders.paper,
        selectedPaperOrders,
        'gid',
      )
      const allOrders = {
        main: mapOrders(activeAlgoOrders.main),
        paper: mapOrders(activeAlgoOrders.paper),
      }
      const unselectedOrders = {
        main: mapOrders(mainOrdersLeft),
        paper: mapOrders(paperOrdersLeft),
      }
      const selectedOrders = {
        main: selectedMainOrders,
        paper: selectedPaperOrders,
      }

      handleActiveOrders({
        type,
        allOrders,
        selectedOrders,
        unselectedOrders,
      })
    },
    [
      activeAlgoOrders.main,
      activeAlgoOrders.paper,
      selectedMainOrders,
      selectedPaperOrders,
      mapOrders,
      handleActiveOrders,
    ],
  )

  const onResumeButtonClickHandler = useCallback(() => {
    if (noOrdersSelected) {
      return
    }
    onSubmit('resume')
  }, [noOrdersSelected, onSubmit])

  const cancellOrders = useCallback(() => onSubmit('cancel_all'), [onSubmit])

  return (
    <Modal
      isOpen={isOpen}
      onClose={cancellOrders}
      onSubmit={onResumeButtonClickHandler}
      label={t('activeAlgoOrdersModal.title')}
      className='hfui-active-ao-modal__wrapper'
      width={900}
    >
      {!isAfterLogin && (
        <AttentionBar green className='message-bar'>
          <p>{t('activeAlgoOrdersModal.restoredConnectionMessage')}</p>
        </AttentionBar>
      )}
      {!_isEmpty(activeAlgoOrders.main) && (
        <AlgoOrdersTable
          orders={activeAlgoOrders.main}
          selectedOrders={selectedMainOrders}
          setSelectedOrders={setSelectedMainOrders}
          isAllOrdersSelected={isAllOrdersSelected}
          title={t('activeAlgoOrdersModal.liveModeAOs')}
        />
      )}
      {!_isEmpty(activeAlgoOrders.paper) && (
        <AlgoOrdersTable
          orders={activeAlgoOrders.paper}
          selectedOrders={selectedPaperOrders}
          setSelectedOrders={setSelectedPaperOrders}
          isAllOrdersSelected={isAllOrdersSelected}
          title={t('activeAlgoOrdersModal.sandboxModeAOs')}
        />
      )}
      <Checkbox
        className='select-all'
        label={t('activeAlgoOrdersModal.selectAllBtn')}
        checked={isAllOrdersSelected()}
        onChange={(e) => onAllOrdersSelect(e)}
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
          disabled={noOrdersSelected}
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
  activeAlgoOrders: PropTypes.shape({
    main: PropTypes.arrayOf(PropTypes.shape(ORDER_SHAPE)),
    paper: PropTypes.arrayOf(PropTypes.shape(ORDER_SHAPE)),
  }),
  isOpen: PropTypes.bool.isRequired,
  isAfterLogin: PropTypes.bool.isRequired,
}

ActiveAlgoOrdersModal.defaultProps = {
  activeAlgoOrders: [],
}

export default React.memo(ActiveAlgoOrdersModal)
