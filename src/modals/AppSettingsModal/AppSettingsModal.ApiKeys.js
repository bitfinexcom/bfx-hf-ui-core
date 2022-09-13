import React, { useState, memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _size from 'lodash/size'
import _trim from 'lodash/trim'
import cx from 'clsx'
import { Button, Intent } from '@ufx-ui/core'

import { useTranslation } from 'react-i18next'
import {
  getAuthToken,
  getPaperAPIKeyState,
  getMainAPIKeyState,
  getIsMainModeApiKeyUpdating,
  getIsPaperModeApiKeyUpdating,
} from '../../redux/selectors/ws'
import { getCurrentMode, getSettingActiveSection } from '../../redux/selectors/ui'
import { changeUIModalState } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import WSActions from '../../redux/actions/ws'
import Input from '../../ui/Input'
import {
  PAPER_MODE,
  MAIN_MODE,
} from '../../redux/reducers/ui'
import ApiBanner from './AppSettingsModal.ApiBanner'
import { getScope } from '../../util/scope'

const ApiKeys = () => {
  const dispatch = useDispatch()
  const authToken = useSelector(getAuthToken)
  const currentMode = useSelector(getCurrentMode)
  const paperAPIKeyState = useSelector(getPaperAPIKeyState)
  const mainAPIKeyState = useSelector(getMainAPIKeyState)
  const isMainApiKeyUpdating = useSelector(getIsMainModeApiKeyUpdating)
  const isPaperApiKeyUpdating = useSelector(getIsPaperModeApiKeyUpdating)
  const activeSection = useSelector(getSettingActiveSection)

  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [paperApiKey, setPaperApiKey] = useState('')
  const [paperApiSecret, setPaperApiSecret] = useState('')

  const { t } = useTranslation()

  const isProductionKeysTouched = _size(_trim(apiKey)) && _size(_trim(apiSecret)) && !isMainApiKeyUpdating
  const isPaperKeysTouched = _size(_trim(paperApiKey)) && _size(_trim(paperApiSecret)) && !isPaperApiKeyUpdating

  const onSaveMainModeApiKey = () => {
    dispatch(WSActions.updatingApiKey(MAIN_MODE, true))
    if (isProductionKeysTouched) {
      dispatch(WSActions.send([
        'api_credentials.save',
        authToken,
        apiKey,
        apiSecret,
        MAIN_MODE,
        currentMode,
        getScope(),
      ]))
    }
  }

  const onSavePaperModeApiKey = () => {
    dispatch(WSActions.updatingApiKey(PAPER_MODE, true))
    if (isPaperKeysTouched) {
      dispatch(WSActions.send([
        'api_credentials.save',
        authToken,
        paperApiKey,
        paperApiSecret,
        PAPER_MODE,
        currentMode,
        getScope(),
      ]))
    }
  }

  const onResetApiKey = (mode) => () => {
    if (mode === MAIN_MODE) {
      dispatch(changeUIModalState(UI_MODAL_KEYS.RESET_LIVE_API_KEY_MODAL, true))
    } else {
      dispatch(changeUIModalState(UI_MODAL_KEYS.RESET_PAPER_API_KEY_MODAL, true))
    }
  }

  const [highlight, setHighlight] = useState(false)

  const getClasses = (mode) => cx('appsettings-modal__setting', {
    highlight: highlight && activeSection === mode,
  })

  useEffect(() => {
    if (activeSection) {
      setTimeout(() => {
        setHighlight(true)
      }, 350)
    }
  })

  return (
    <div>
      <div className={getClasses(MAIN_MODE)}>
        <div className='appsettings-modal__key-title-wrapper'>
          <span className='appsettings-modal__key-title'>
            {t('appSettings.productionKey')}
          </span>
          {' '}
          <a
            href='https://support.bitfinex.com/hc/en-us/articles/115002349625-API-Key-Setup-Login'
            target='_blank'
            rel='noopener noreferrer'
            className='appsettings-modal__key-text appsettings-modal__key-link'
          >
            <i className='fa fa-info-circle' />
            {' '}
            {t('appSettings.howToCreate')}
          </a>
          <div className='appsettings-modal__key-text appsettings-modal__key-desc'>{t('appSettings.howToCreateDesc')}</div>
        </div>
        <ApiBanner
          apiKeyState={mainAPIKeyState}
          isUpdating={isMainApiKeyUpdating}
        />
        <div className='appsettings-modal__input'>
          <Input
            type='text'
            placeholder={t('appSettings.apiKey')}
            onChange={setApiKey}
            value={apiKey}
            autocomplete='off'
          />
        </div>
        <div className='appsettings-modal__input'>
          <Input
            type='password'
            placeholder={t('appSettings.apiSecret')}
            onChange={setApiSecret}
            value={apiSecret}
            autocomplete='off'
          />
        </div>
        <Button
          intent={Intent.PRIMARY}
          small
          onClick={onSaveMainModeApiKey}
          disabled={!isProductionKeysTouched}
        >
          {mainAPIKeyState.configured ? t('ui.updateBtn') : t('ui.save')}
        </Button>
        <Button
          intent={Intent.SECONDARY}
          className='reset_button'
          small
          onClick={onResetApiKey(MAIN_MODE)}
          disabled={!!isProductionKeysTouched}
        >
          {t('ui.reset')}
        </Button>
      </div>
      <div className={getClasses(PAPER_MODE)}>
        <div className='appsettings-modal__key-title-wrapper'>
          <span className='appsettings-modal__key-title'>
            {t('appSettings.paperKey')}
          </span>
          {' '}
          <a
            href='https://support.bitfinex.com/hc/en-us/articles/900001525006-Paper-Trading-test-learn-and-simulate-trading-strategies-'
            target='_blank'
            rel='noopener noreferrer'
            className='appsettings-modal__key-text appsettings-modal__key-link'
          >
            <i className='fa fa-info-circle' />
            {' '}
            {t('appSettings.howToCreatePaper')}
          </a>
          <div className='appsettings-modal__key-text appsettings-modal__key-desc'>{t('appSettings.howToCreatePaperDesc')}</div>
        </div>

        <ApiBanner
          apiKeyState={paperAPIKeyState}
          isUpdating={isPaperApiKeyUpdating}
        />
        <div className='appsettings-modal__input'>
          <Input
            type='text'
            placeholder={t('appSettings.apiKey')}
            onChange={setPaperApiKey}
            value={paperApiKey}
            autocomplete='off'
          />
        </div>
        <div className='appsettings-modal__input'>
          <Input
            type='password'
            placeholder={t('appSettings.apiSecret')}
            onChange={setPaperApiSecret}
            value={paperApiSecret}
            autocomplete='off'
          />
        </div>
        <Button
          intent={Intent.PRIMARY}
          small
          onClick={onSavePaperModeApiKey}
          disabled={!isPaperKeysTouched}
        >
          {paperAPIKeyState.configured ? t('ui.updateBtn') : t('ui.save')}
        </Button>
        <Button
          intent={Intent.SECONDARY}
          className='reset_button'
          small
          onClick={onResetApiKey(PAPER_MODE)}
          disabled={!!isProductionKeysTouched}
        >
          {t('ui.reset')}
        </Button>
      </div>
    </div>
  )
}

export default memo(ApiKeys)
