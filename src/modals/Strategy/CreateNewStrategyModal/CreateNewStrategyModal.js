import React, { useState, memo } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Templates from '../../../components/StrategyEditor/templates'

import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import Dropdown from '../../../ui/Dropdown'

import './style.css'

const MAX_LABEL_LENGTH = 150

const CreateNewStrategyModal = ({
  onSubmit, onClose, gaCreateStrategy, isOpen,
}) => {
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')
  const [template, setTemplate] = useState('Blank')

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

    onSubmit(label, template)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='hfui-createnewstrategymodal__wrapper'
      label={t('strategyEditor.newStrategyModalTitle')}
    >

      <Input
        type='text'
        placeholder='Label'
        value={label}
        onChange={setLabel}
      />

      <Dropdown
        value={template}
        onChange={setTemplate}
        options={_map(Templates, _t => ({
          label: _t.label,
          value: _t.label,
        }))}
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
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
