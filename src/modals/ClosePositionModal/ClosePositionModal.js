import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import _isEmpty from 'lodash/isEmpty'

import Modal from '../../ui/Modal'

import './style.css'

const ClosePositionModal = ({
  rowData, changeClosePositionModalState, visible, closePosition, authToken, getMarketPair,
}) => {
  const { t } = useTranslation()
  const [pair, setPair] = useState(null)

  // delay setting the pair to '' so there won't be flickering when closing the modal
  useEffect(() => {
    if (_isEmpty(rowData)) {
      setTimeout(() => {
        setPair('')
      }, 100)
    } else {
      setPair(getMarketPair(rowData?.symbol))
    }
  }, [rowData, getMarketPair])

  const onClose = () => {
    changeClosePositionModalState(false, {})
  }

  const onSubmit = () => {
    closePosition(authToken, rowData)
    onClose()
  }

  return (
    <Modal
      label={t('closePositionModal.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='close_position-modal'
    >
      <Icon
        name='warning'
        aria-label='Warning'
      />
      <p>{t('closePositionModal.body', { pair })}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

ClosePositionModal.propTypes = {
  changeClosePositionModalState: PropTypes.func.isRequired,
  getMarketPair: PropTypes.func.isRequired,
  closePosition: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  authToken: PropTypes.string.isRequired,
  rowData: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number, PropTypes.object, PropTypes.string,
  ])),
}

ClosePositionModal.defaultProps = {
  rowData: {},
}

export default memo(ClosePositionModal)
