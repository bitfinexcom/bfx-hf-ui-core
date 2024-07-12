import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

import './style.css'

const NoConnectionActionModal = ({
  onClose, visible,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      label={t('noConnectionActionModal.title')}
      className='hfui-no-conn-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onClose}
    >
      <p>{t('noConnectionActionModal.description')}</p>
      <Modal.Footer>
        <Modal.Button onClick={onClose} primary>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

NoConnectionActionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(NoConnectionActionModal)
