import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

const OldFormatModal = ({ changeOldFormatModalState, visible }) => {
  const onSubmit = () => {
    changeOldFormatModalState(false)
  }

  const { t } = useTranslation()

  return (
    <Modal
      label={t('oldFormatModal.title')}
      isOpen={visible}
      onClose={onSubmit}
      onSubmit={onSubmit}
    >
      <p>{t('oldFormatModal.text1')}</p>
      <p>{t('oldFormatModal.text2')}</p>
      <br />
      <p>{t('oldFormatModal.text3')}</p>
      <Modal.Footer>
        <Modal.Button
          onClick={onSubmit}
          primary
        >
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

OldFormatModal.propTypes = {
  changeOldFormatModalState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(OldFormatModal)
