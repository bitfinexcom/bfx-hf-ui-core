import { useTranslation } from 'react-i18next'
import React, { useEffect, useState, memo } from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 35

const RemoveExistingStrategyModal = ({
  isOpen,
  onRemoveStrategy,
  onClose,
  strategy: { label },
}) => {
  const [canDeleteStrategy, setCanDeleteStrategy] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const isLong = _size(label) > MAX_STRATEGY_LABEL_LENGTH

  const removeStrategy = () => {
    if (!canDeleteStrategy) {
      return
    }
    onRemoveStrategy()
    setCanDeleteStrategy(false)
  }

  useEffect(() => {
    if (inputValue !== label) {
      if (canDeleteStrategy) {
        setCanDeleteStrategy(false)
      }
      return
    }
    setCanDeleteStrategy(true)
  }, [canDeleteStrategy, inputValue, label])

  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={removeStrategy}
      className='hfui-removestrategymodal__wrapper'
      label={t('removeExistingStrategyModal.title')}
    >
      <div className='hfui-removestrategymodal__content'>
        <p>
          {t('removeExistingStrategyModal.text_1')}
          &nbsp;
          <b>{label}</b>
          &nbsp;
          {t('removeExistingStrategyModal.text_2')}
        </p>
        <p>
          <b>
            {t('removeExistingStrategyModal.warning_1')}
            :
          </b>
          &nbsp;
          <i>{t('removeExistingStrategyModal.warning_2')}</i>
        </p>
        <Input
          type='text'
          value={inputValue}
          onChange={setInputValue}
          placeholder={t('removeExistingStrategyModal.input_placeholder', {
            label: isLong
              ? t('removeExistingStrategyModal.strategyName')
              : label,
          })}
        />
      </div>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button
          primary
          disabled={!canDeleteStrategy}
          onClick={removeStrategy}
        >
          {t('ui.deleteBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

RemoveExistingStrategyModal.propTypes = {
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRemoveStrategy: PropTypes.func.isRequired,
}

RemoveExistingStrategyModal.defaultProps = {
  isOpen: true,
  strategy: {
    label: '',
  },
}

export default memo(RemoveExistingStrategyModal)
