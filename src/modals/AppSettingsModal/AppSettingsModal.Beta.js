import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Checkbox } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { SETTINGS_KEYS, getIsBetaVersion } from '../../redux/selectors/ui'
import InnerModal from '../../ui/InnerModal/InnerModal'
import AttentionBar from '../../ui/AttentionBar/AttentionBar'

const Beta = () => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const isBetaVersion = useSelector(getIsBetaVersion)

  const closeBetaModal = () => setIsBetaModalOpen(false)

  const openBetaModal = () => setIsBetaModalOpen(true)

  const onBetaCheckboxClickHandler = (isChecked) => {
    if (isChecked) {
      openBetaModal()
      return
    }
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.JOIN_BETA_PROGRAM, false))
    dispatch(GAActions.updateSettings())
  }

  const updateBetaProgram = (e) => {
    e.stopPropagation()
    dispatch(WSActions.saveSetting(SETTINGS_KEYS.JOIN_BETA_PROGRAM, true))
    dispatch(GAActions.updateSettings())
    closeBetaModal()
  }

  return (
    <div>
      <div className='appsettings-modal__setting appsettings-modal__setting--beta'>
        <Checkbox
          onChange={onBetaCheckboxClickHandler}
          label={t('appSettings.betaProgramCheckbox')}
          checked={isBetaVersion}
          className='appsettings-modal__checkbox'
        />
        <div className='appsettings-modal__description'>
          {t('appSettings.betaProgramText')}
        </div>
      </div>
      <AttentionBar green>
        {t('appSettings.betaDesclaimer')}
      </AttentionBar>
      {isBetaModalOpen && (
        <InnerModal
          title={(
            <span className='beta-modal__title'>
              {t('appSettings.betaModalTitle')}
            </span>
          )}
          onClose={closeBetaModal}
          className='beta-modal'
        >
          <div>
            <div className='beta-modal__content'>
              {t('appSettings.betaDesclaimer')}
            </div>
            <Button onClick={updateBetaProgram} className='beta-modal__button'>
              {t('appSettings.betaProgramCheckbox')}
            </Button>
          </div>
        </InnerModal>
      )}
    </div>
  )
}

export default memo(Beta)
