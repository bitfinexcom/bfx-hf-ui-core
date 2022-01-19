/* eslint-disable react/prop-types */
import React, { useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Joyride from 'react-joyride'
import { getLocaleOptions } from './Joyride.helpers'

const HoneyJoyride = ({ styles: _styles, ...props }) => {
  const { t } = useTranslation()
  const locale = useMemo(() => getLocaleOptions(t), [t])
  const styles = useMemo(() => ({
    ..._styles,
    options: {
      arrowColor: '#243d50',
      backgroundColor: '#243d50',
      overlayColor: 'rgba(0, 0, 0, 0.4)',
      primaryColor: '#05bc97',
      textColor: '#f2f9ff',
      zIndex: 10000,
      ..._styles?.options,
    },
  }), [_styles])

  return (
    <Joyride
      continuous
      showProgress
      showSkipButton
      styles={styles}
      locale={locale}
      {...props}
    />
  )
}

export default memo(HoneyJoyride)
