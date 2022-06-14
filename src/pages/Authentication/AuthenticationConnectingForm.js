import React from 'react'
import { useTranslation } from 'react-i18next'

const AuthenticationConnectingForm = () => {
  const { t } = useTranslation()
  return (
    <div className='hfui-authenticationpage__content'>
      <h2>Bitfinex Honey UI</h2>
      <p>{t('main.startingUp')}</p>
    </div>
  )
}

export default AuthenticationConnectingForm
