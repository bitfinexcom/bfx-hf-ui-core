import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'

import Modal from '../../ui/Modal'
import { DONT_SHOW_DMS_MODAL_KEY } from '../../constants/variables'

import './style.css'

const ConfirmDMSModal = ({
  changeDMSSetting, changeConfirmDMSModalState, visible,
}) => {
  const { t } = useTranslation()
  const [dontShowAgain, setDontShowAgain] = useState(localStorage.getItem(DONT_SHOW_DMS_MODAL_KEY) === 'true')

  const processDontShowAgain = () => {
    if (dontShowAgain) {
      localStorage.setItem(DONT_SHOW_DMS_MODAL_KEY, 'true')
    }
  }

  const onClose = () => {
    changeConfirmDMSModalState(false)
  }

  const onSubmit = () => {
    changeDMSSetting(true)
    onClose()
    processDontShowAgain()
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
        <Checkbox
          label={t('confirmDMSModal.dontShowAgain')}
          checked={dontShowAgain}
          onChange={setDontShowAgain}
        />
        <div>
          <Modal.Button secondary onClick={onClose}>
            {t('ui.cancel')}
          </Modal.Button>
          <Modal.Button primary onClick={onSubmit}>
            {t('ui.ok')}
          </Modal.Button>
        </div>
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
