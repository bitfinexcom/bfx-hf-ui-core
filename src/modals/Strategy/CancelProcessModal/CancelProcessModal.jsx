import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '../../../ui/Modal'
import './style.css'

const CancelProcessModal = ({
  onSubmit, onClose, isOpen,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      className='hfui-cancelprocessmodal'
      label={t('strategyEditor.cancelAppProcessTitle')}
    >
      <div className='hfui-cancelprocessmodal__content'>
        {t('strategyEditor.cancelAppProcessDescription')}
      </div>
      <Modal.Footer className='hfui-cancelprocessmodal__footer'>
        <Modal.Button primary onClick={onSubmit}>
          {t('strategyEditor.cancelAppProcessSubmit')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

CancelProcessModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
}

CancelProcessModal.defaultProps = {
  isOpen: true,
}

export default memo(CancelProcessModal)
