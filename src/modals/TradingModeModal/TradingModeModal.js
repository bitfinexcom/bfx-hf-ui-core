import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

const TradingModeModal = ({
  authToken,
  currentMode,
  isPaperTrading,
  changeTradingMode,
  changeTradingModeModalState,
  isTradingModeModalVisible,
}) => {
  const onTradingModeModalClose = () => {
    changeTradingModeModalState(false)
  }

  const onTradingModeModalSubmit = () => {
    changeTradingMode(!isPaperTrading, authToken, currentMode)
    location.replace('/index.html'); // eslint-disable-line
  }

  const { t } = useTranslation()

  return (
    <Modal
      label={t('tradingModeModal.title')}
      isOpen={isTradingModeModalVisible}
      onClose={onTradingModeModalClose}
      onSubmit={onTradingModeModalSubmit}
    >
      <p>{t('tradingModeModal.text')}</p>
      <Modal.Footer>
        <Modal.Button primary onClick={onTradingModeModalSubmit}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

TradingModeModal.propTypes = {
  authToken: PropTypes.string.isRequired,
  currentMode: PropTypes.string.isRequired,
  changeTradingMode: PropTypes.func.isRequired,
  changeTradingModeModalState: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  isTradingModeModalVisible: PropTypes.bool.isRequired,
}

export default memo(TradingModeModal)
