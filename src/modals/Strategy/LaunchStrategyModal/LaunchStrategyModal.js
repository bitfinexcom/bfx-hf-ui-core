import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import Modal from '../../../ui/Modal'
import routes from '../../../constants/routes'

import './style.css'

const LaunchStrategyModal = ({
  onSubmit,
  onClose,
  isOpen,
  isPaperTrading,
  changeTradingMode,
  authToken,
  currentMode,
  strategyId,
}) => {
  const { t } = useTranslation()
  const history = useHistory()

  const _onSubmit = () => {
    if (isPaperTrading) {
      changeTradingMode(!isPaperTrading, authToken, currentMode)
      history.push(`${routes.strategyEditor.path}?execute=${strategyId}`)
      setTimeout(() => window.location.reload(), 500)
      return
    }
    onSubmit()
    onClose()
  }

  return (
    <Modal
      label={t('launchStrategyModal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={_onSubmit}
      className='launch-strategy-modal'
    >
      <p>{t('launchStrategyModal.body')}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button primary onClick={_onSubmit}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

LaunchStrategyModal.propTypes = {
  isPaperTrading: PropTypes.bool.isRequired,
  strategyId: PropTypes.string.isRequired,
  changeTradingMode: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  currentMode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

LaunchStrategyModal.defaultProps = {
}

export default memo(LaunchStrategyModal)
