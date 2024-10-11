import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'

import './style.css'

const DiscardAOEdit = ({
  onClose, onSubmit, visible,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      label={t('discardAOEdit.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='discard-ao-modal'
    >
      <p>{t('discardAOEdit.text')}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.goBack')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('ui.discardChanges')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

DiscardAOEdit.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(DiscardAOEdit)
