import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Checkbox } from '@ufx-ui/core'
import WSActions from '../../redux/actions/ws'
import Modal from '../../ui/Modal'
import {
  removeStoredPassword,
  updateAutoLoginState,
} from '../../util/autologin'
import { IS_PAPER_TRADING } from '../../redux/reducers/ui'
import Input from '../../ui/Input'

import './style.css'

const ResetDataConfirmModal = ({ isOpen, onClose }) => {
  const [shouldExportToJSON, setShouldExportToJSON] = useState(true)
  const [password, setPassword] = useState('')

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onReset = () => {
    dispatch(WSActions.send(['get.saved_decrypted_strategies', '1', 'paper']))
    // removeStoredPassword()
    // updateAutoLoginState()
    // dispatch(WSActions.resetAuth())
    // window.localStorage.setItem(IS_PAPER_TRADING, false)
  }

  return (
    <Modal
      label={t('resetDataConfirmModal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onReset}
      className='reset-data-confirm-modal'
    >
      <div className='reset-data-confirm-modal__content'>
        <p>{t('resetDataConfirmModal.text')}</p>
        <Checkbox
          label={t('resetDataConfirmModal.exportToJSON')}
          checked={shouldExportToJSON}
          onChange={setShouldExportToJSON}
        />
        {shouldExportToJSON && (
          <>
            <p>{t('resetDataConfirmModal.passwordRequest')}</p>
            <Input
              type='password'
              autocomplete='current-password'
              placeholder={t('auth.password')}
              value={password}
              onChange={setPassword}
            />
          </>
        )}
      </div>
      <Modal.Footer>
        <div>
          <Modal.Button secondary onClick={onClose}>
            {t('ui.cancel')}
          </Modal.Button>
          <Modal.Button primary onClick={onReset}>
            {t('ui.proceed')}
          </Modal.Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

ResetDataConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ResetDataConfirmModal
