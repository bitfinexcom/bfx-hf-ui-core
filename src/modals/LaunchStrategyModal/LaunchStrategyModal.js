import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'

import './style.css'

const LaunchStrategyModal = ({
  options, changeLaunchStrategyModalState, visible, dsExecuteLiveStrategy,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    changeLaunchStrategyModalState(false, {})
  }

  const onSubmit = () => {
    dsExecuteLiveStrategy(options)
    onClose()
  }

  return (
    <Modal
      label={t('launchStrategyModal.title')}
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='launch-strategy-modal'
    >
      <p>{t('launchStrategyModal.body')}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

LaunchStrategyModal.propTypes = {
  changeLaunchStrategyModalState: PropTypes.func.isRequired,
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  options: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number, PropTypes.object, PropTypes.string, PropTypes.bool,
  ])),
}

LaunchStrategyModal.defaultProps = {
  options: {},
}

export default memo(LaunchStrategyModal)
