import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

import './style.css'

const ConfirmDMSModal = ({
  changeDMSSetting, changeConfirmDMSModalState, visible,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    changeConfirmDMSModalState(false)
  }

  const onSubmit = () => {
    changeDMSSetting(true)
    onClose()
  }

  return (
    <Modal
      label={t('confirmDMSModal.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='confirm_dms-modal'
    >
      <p>{t('confirmDMSModal.text')}</p>
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

ConfirmDMSModal.propTypes = {
  changeConfirmDMSModalState: PropTypes.func.isRequired,
  changeDMSSetting: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(ConfirmDMSModal)
