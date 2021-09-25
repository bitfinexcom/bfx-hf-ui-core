/* eslint-disable react/prop-types */
import React from 'react'
import { useTranslation } from 'react-i18next'
import Joyride from 'react-joyride'
import { getLocaleOptions } from './Joyride.helpers'

export default function HoneyJoyride({ styles = {}, ...props }) {
  const { t } = useTranslation()
  return (
    <Joyride
      continuous
      showProgress
      showSkipButton
      styles={{
        ...styles,
        options: {
          arrowColor: '#243d50',
          backgroundColor: '#243d50',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          primaryColor: '#05bc97',
          textColor: '#f2f9ff',
          zIndex: 10000,
          ...styles.options,
        },
      }}
      locale={getLocaleOptions(t)}
      {...props}
    />
  )
}
