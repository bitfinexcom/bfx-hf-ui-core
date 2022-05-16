import React from 'react'
import { useTranslation } from 'react-i18next'

import APIKeysConfigurateForm from '../APIKeysConfigurateForm'

const ConnectingModal = () => {
  const { t } = useTranslation()
  return (
    <APIKeysConfigurateForm
      title='CONNECTING'
      icon='icon-api'
      content={<p>{t('appSettings.apiConnecting')}</p>}
    />
  )
}

export default ConnectingModal
