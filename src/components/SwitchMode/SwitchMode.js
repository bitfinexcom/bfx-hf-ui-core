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
  isPaperTrading, authToken, currentMode, changeAppMode, settingsTheme,
}) => {
  const onChange = () => {
    changeAppMode(!isPaperTrading, authToken, currentMode)
    // eslint-disable-next-line lodash/prefer-lodash-method
    window.location.replace('/index.html')
  }

  return (
    <ToggleSwitch
      checked={isPaperTrading}
      onChange={onChange}
    // disabled={isTradingModeModalVisible}
      onColor={SWITCH_THEME[settingsTheme].onColor}
      offColor={SWITCH_THEME[settingsTheme].offColor}
      className='toggle-switch'
      aria-label='Switch Paper Trading mode'
    />
  )
}

SwitchMode.propTypes = {
  changeAppMode: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default memo(SwitchMode)
