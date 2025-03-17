import React, { memo } from 'react'
import { Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import AttentionBar from '../../ui/AttentionBar/AttentionBar'

const Beta = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div className='appsettings-modal__setting appsettings-modal__setting--beta'>
        <Checkbox
          label={t('appSettings.betaProgramCheckbox')}
          checked={false}
          className='appsettings-modal__checkbox'
          disabled
        />
        <div className='appsettings-modal__description'>
          <s>{t('appSettings.betaProgramText')}</s>
        </div>
      </div>
      <AttentionBar red>
        {t('appSettings.betaDisclaimerNoFeatures')}
      </AttentionBar>
    </div>
  )
}

export default memo(Beta)
