import React, { useState, memo, useCallback } from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import blankTemplate from '../../../components/StrategyEditor/templates/blank'
import { validateStrategyName } from '../Strategy.helpers'

import './style.css'

const CreateNewStrategyModal = ({
  onSubmit, onClose, isOpen,
}) => {
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const { t } = useTranslation()

  const onSubmitHandler = useCallback(() => {
    const err = validateStrategyName(label, t)
    setError(err)
    if (err) {
      return
    }

    onSubmit(label, blankTemplate)
    onClose()
  }, [label, onClose, onSubmit, t])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitHandler}
      className='hfui-createnewstrategymodal'
      label={t('strategyEditor.newStrategyModalTitle')}
    >
      <div className='hfui-createnewstrategymodal__content'>
        <Input
          type='text'
          placeholder={t('ui.name')}
          value={label}
          onChange={setLabel}
        />

        {!_isEmpty(error) && <p className='error'>{error}</p>}

      </div>
      <Modal.Footer className='hfui-createnewstrategymodal__footer'>
        <Modal.Button primary onClick={onSubmitHandler}>
          {t('ui.createBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

CreateNewStrategyModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
}

CreateNewStrategyModal.defaultProps = {
  isOpen: true,
}

export default memo(CreateNewStrategyModal)
