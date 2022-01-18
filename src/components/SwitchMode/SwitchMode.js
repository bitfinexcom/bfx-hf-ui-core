import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { ToggleSwitch } from 'react-dragswitch'

import { THEMES } from '../../redux/selectors/ui'

const SWITCH_THEME = {
  [THEMES.LIGHT]: {
    onColor: '#07aa8c',
    offColor: '#818e9a',
  },
  [THEMES.DARK]: {
    onColor: '#244e3f',
    offColor: '#4c5a63',
  },
}

const SwitchMode = ({
  isPaperTrading, isTradingModeModalVisible, openTradingModeModal, settingsTheme,
}) => (
  <ToggleSwitch
    checked={isPaperTrading}
    onChange={openTradingModeModal}
    disabled={isTradingModeModalVisible}
    onColor={SWITCH_THEME[settingsTheme].onColor}
    offColor={SWITCH_THEME[settingsTheme].offColor}
    className='toggle-switch'
    aria-label='Switch Paper Trading mode'
  />
)

SwitchMode.propTypes = {
  openTradingModeModal: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  isTradingModeModalVisible: PropTypes.bool.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default memo(SwitchMode)
