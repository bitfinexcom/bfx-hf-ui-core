import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Intent } from '@ufx-ui/core'
import Input from '../../ui/Input'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import { getTimestampFormat, SETTINGS_KEYS } from '../../redux/selectors/ui'
import { SETUP_TIMESTAMP_FORMAT_ARTICLE } from '../../redux/config'
import i18n, { DATE_FNS_LOCALES } from '../../locales/i18n'

const getCurrentDateStringInLocalFormat = () => new Date().toLocaleString()

const TimeFormatSetting = () => {
  const [formatInput, setFormatInput] = useState()
  const [preview, setPreview] = useState(getCurrentDateStringInLocalFormat())
  const [isValid, setIsValid] = useState(true)

  const savedTimestampFormat = useSelector(getTimestampFormat)

  const isSubmitButtonDisabled = !formatInput || !isValid || formatInput === savedTimestampFormat

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const formatCurrentTime = (formatStr) => {
    const i18nMappedKey = i18n.getMappedLanguageKey()
    return format(new Date(), formatStr, { locale: DATE_FNS_LOCALES[i18nMappedKey] })
  }
  const onChange = (value) => {
    try {
      const formatedTime = value
        ? formatCurrentTime(value)
        : getCurrentDateStringInLocalFormat()

      setIsValid(true)
      setFormatInput(value)
      setPreview(formatedTime)
    } catch {
      setIsValid(false)
      setFormatInput(value)
      setPreview(null)
    }
  }

  const saveSetting = (value) => {
    dispatch(WSActions.saveSettings(SETTINGS_KEYS.TIMESTAMP_FORMAT, value))
    dispatch(GAActions.updateSettings())
  }

  const onSubmit = () => {
    if (!isValid) {
      return
    }

    saveSetting(formatInput)
  }

  const resetTimestampFormat = () => {
    onChange('')
    saveSetting('')
  }

  useEffect(() => {
    setFormatInput(savedTimestampFormat)
    if (savedTimestampFormat) {
      try {
        setPreview(formatCurrentTime(savedTimestampFormat))
      } catch (e) {
        console.error(e)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTimestampFormat, i18n.language])

  return (
    <div className='appsettings-modal__setting'>
      <p className=''>
        {t('appSettings.timestampFormat')}
        {' '}
        <a
          href={SETUP_TIMESTAMP_FORMAT_ARTICLE}
          target='_blank'
          rel='noopener noreferrer'
          className='appsettings-modal__key-text appsettings-modal__key-link'
        >
          <i className='fa fa-info-circle' />
          {' '}
          {t('appSettings.timestampFormatHelpLink')}
        </a>
      </p>

      <Input
        value={formatInput}
        onChange={onChange}
        placeholder={t('appSettings.localTimestampFormat')}
        type='text'
      />

      {!isValid && formatInput && (
        <p className='hfui-red'>{t('appSettings.invalidTimestampFormat')}</p>
      )}
      {preview && (
        <p>{t('appSettings.timestampFormatPreview', { date: preview })}</p>
      )}

      <Button
        intent={Intent.PRIMARY}
        onClick={onSubmit}
        disabled={isSubmitButtonDisabled}
        small
      >
        {t('ui.updateBtn')}
      </Button>
      <Button
        intent={Intent.SECONDARY}
        className='reset_button'
        small
        onClick={resetTimestampFormat}
        disabled={!formatInput}
      >
        {t('appSettings.resetToDefaultBtn')}
      </Button>
    </div>
  )
}

export default TimeFormatSetting
