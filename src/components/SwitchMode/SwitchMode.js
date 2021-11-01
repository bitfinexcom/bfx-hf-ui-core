import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { ToggleSwitch } from 'react-dragswitch'

const SwitchMode = ({
  isPaperTrading, isTradingModeModalVisible, openTradingModeModal,
}) => (
  <ToggleSwitch
    checked={isPaperTrading}
    onChange={openTradingModeModal}
    disabled={isTradingModeModalVisible}
    onColor='#244e3f'
    offColor='#4c5a63'
    className='toggle-switch'
    aria-label='Switch Paper Trading mode'
  />
)

SwitchMode.propTypes = {
  openTradingModeModal: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  isTradingModeModalVisible: PropTypes.bool.isRequired,
}

export default memo(SwitchMode)
