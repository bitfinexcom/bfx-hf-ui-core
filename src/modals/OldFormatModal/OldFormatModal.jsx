import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const OldFormatModal = ({ changeUIModalState, visible }) => {
  const onSubmit = () => {
    changeUIModalState(UI_MODAL_KEYS.OLD_FORMAT_MODAL, false)
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
  changeUIModalState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(OldFormatModal)
