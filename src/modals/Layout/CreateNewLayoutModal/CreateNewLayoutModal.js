import React, { useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import { createLayout } from '../../../redux/actions/ui'

import './style.css'

const CreateNewLayoutModal = ({ onClose, isOpen }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const onSubmitHandler = () => {
    if (_isEmpty(label)) {
      setError(t('layoutSettings.labelEmptyError'))
      return
    }

    dispatch(createLayout(label))
    setLabel('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitHandler}
      className='hfui-createnewlayoutmodal__wrapper'
      label={t('layoutSettings.addLayout')}
    >
      <Input
        type='text'
        placeholder={t('layoutSettings.layoutName')}
        value={label}
        onChange={setLabel}
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
        <Modal.Button
          primary
          onClick={onSubmitHandler}
        >
          {t('layoutSettings.addLayout')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

CreateNewLayoutModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(CreateNewLayoutModal)
