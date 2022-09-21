import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

import './style.css'

const NoConnectionActionModal = ({
  changeIsNoConnectionModalState, visible,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    changeIsNoConnectionModalState(false)
  }

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
  changeIsNoConnectionModalState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(NoConnectionActionModal)
