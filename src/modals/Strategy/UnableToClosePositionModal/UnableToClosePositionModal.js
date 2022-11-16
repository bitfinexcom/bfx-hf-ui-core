import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '../../../ui/Modal'
import './style.css'

const UnableToClosePositionModal = ({
  onClose, isOpen,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='hfui-unabletoclosepositionmodal'
      label={t('strategyEditor.unableToCloseTitle')}
    >
      <div className='hfui-unabletoclosepositionmodal__content'>
        {t('strategyEditor.unableToCloseDescription')}
      </div>
      <Modal.Footer>
        <Modal.Button primary onClick={onClose}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

UnableToClosePositionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
}

UnableToClosePositionModal.defaultProps = {
  isOpen: false,
}

export default memo(UnableToClosePositionModal)
