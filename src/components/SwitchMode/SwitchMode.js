import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { ToggleSwitch } from 'react-dragswitch'
import { useTranslation } from 'react-i18next'

import { Tooltip } from '@ufx-ui/core'
import { THEMES } from '../../redux/selectors/ui'

export const SWITCH_THEME = {
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
  isPaperTrading, changeTradingMode, settingsTheme,
}) => {
  const { t } = useTranslation()
  const onChangeTradingMode = () => {
    changeTradingMode(!isPaperTrading)
  }

  const content = isPaperTrading ? 'productionTradingText' : 'paperTradingText'

  return (
    <Tooltip content={t(`appSettings.${content}`)}>
      <ToggleSwitch
        checked={isPaperTrading}
        onChange={onChangeTradingMode}
        onColor={SWITCH_THEME[settingsTheme].onColor}
        offColor={SWITCH_THEME[settingsTheme].offColor}
        className='toggle-switch'
        aria-label='Switch Sandbox mode'
      />
    </Tooltip>
  )
}

SwitchMode.propTypes = {
  changeTradingMode: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

export default memo(SwitchMode)
