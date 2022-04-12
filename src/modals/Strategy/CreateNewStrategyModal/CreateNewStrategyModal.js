import React, { useState, memo } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH,
} from '../../../constants/variables'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import blankTemplate from '../../../components/StrategyEditor/templates/blank'

import './style.scss'

const CreateNewStrategyModal = ({
  onSubmit, onClose, gaCreateStrategy, isOpen,
}) => {
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const { t } = useTranslation()

  const onSubmitHandler = () => {
    const labelSize = _size(label)

    if (_isEmpty(label)) {
      setError(t('strategyEditor.newStrategyModalEmptyError'))
      return
    }

    if (labelSize > MAX_LABEL_LENGTH) {
      setError(t('strategyEditor.newStrategyModalLongError', { labelSize, MAX_LABEL_LENGTH }))
      return
    }

    gaCreateStrategy()

    onSubmit(label, blankTemplate)
    onClose()
  }

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

        {!_isEmpty(error) && (
        <p className='error'>{error}</p>
        )}
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
  gaCreateStrategy: PropTypes.func,
  isOpen: PropTypes.bool,
}

CreateNewStrategyModal.defaultProps = {
  gaCreateStrategy: () => { },
  isOpen: true,
}

export default memo(CreateNewStrategyModal)
