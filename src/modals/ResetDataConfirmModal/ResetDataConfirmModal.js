import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'
import Modal from '../../ui/Modal'

const ResetDataConfirmModal = ({ isOpen, onClose }) => {
  const [shouldExportToJSON, setShouldExportToJSON] = useState(true)

  const { t } = useTranslation()

  const onSubmitClick = () => {

  }

  return (
    <Modal
      label={t('resetDataConfirmModal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitClick}
      className='confirm_dms-modal'
    >
      <p>{t('resetDataConfirmModal.text')}</p>
      <br />
      <Checkbox
        label={t('resetDataConfirmModal.exportToJSON')}
        checked={shouldExportToJSON}
        onChange={setShouldExportToJSON}
      />
      <Modal.Footer>
        <div>
          <Modal.Button secondary onClick={onClose}>
            {t('ui.cancel')}
          </Modal.Button>
          <Modal.Button primary onClick={onSubmitClick}>
            {t('ui.proceed')}
          </Modal.Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ResetDataConfirmModal
