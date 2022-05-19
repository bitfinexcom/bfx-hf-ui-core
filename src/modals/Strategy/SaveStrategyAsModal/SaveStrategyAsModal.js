import React, { useState, memo, useEffect } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import {
  MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH,
} from '../../../constants/variables'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'

const SaveStrategyAsModal = ({
  onSubmit, onClose, isOpen, strategy,
}) => {
  const [label, setLabel] = useState()
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

    onSubmit({ ...strategy, label })
    onClose()
  }

  useEffect(() => {
    if (_isEmpty(label) && strategy?.label) {
      setLabel(strategy.label)
    }
  }, [strategy, label])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitHandler}
      className='hfui-createnewstrategymodal'
      label={t('strategyEditor.saveStrategyAsModalTitle')}
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
          {t('strategyEditor.saveWithDifferentName')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

SaveStrategyAsModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
}

SaveStrategyAsModal.defaultProps = {
  strategy: {
    label: '',
  },
  isOpen: true,
}

export default memo(SaveStrategyAsModal)
