import React, {
  useState, memo, useEffect, useCallback,
} from 'react'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import { validateStrategyName } from '../Strategy.helpers'

const SaveStrategyAsModal = ({
  onSubmit, onClose, isOpen, strategy,
}) => {
  const [label, setLabel] = useState()
  const [error, setError] = useState('')

  const { t } = useTranslation()

  const onSubmitHandler = useCallback(() => {
    const err = validateStrategyName(label, t)
    setError(err)
    if (err) {
      return
    }

    onSubmit({ ...strategy, label })
    onClose()
  }, [label, onClose, onSubmit, strategy, t])

  useEffect(() => {
    if (strategy?.label) {
      setLabel(strategy.label)
    }
  }, [strategy.label])

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

        {!_isEmpty(error) && <p className='error'>{error}</p>}
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
