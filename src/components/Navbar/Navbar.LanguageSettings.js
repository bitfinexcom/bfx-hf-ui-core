import React from 'react'
import _keys from 'lodash/keys'
import _map from 'lodash/map'

import { useTranslation } from 'react-i18next'
import Dropdown from '../../ui/Dropdown'
import { LANGUAGES, LANGUAGE_NAMES } from '../../locales/i18n'

const languagesKeys = _keys(LANGUAGE_NAMES)
const languagesOptions = _map(languagesKeys, lang => ({ value: lang, label: LANGUAGE_NAMES[lang] }))

const LanguageSettings = () => {
  const { i18n } = useTranslation()

  const i18nMappedKey = i18n.getMappedLanguageKey()

  const changeLanguageHandler = (lang) => i18n.changeLanguage(LANGUAGES[lang])

  return (
    <Dropdown
      value={i18nMappedKey}
      options={languagesOptions}
      placeholder={LANGUAGE_NAMES[i18nMappedKey] || LANGUAGE_NAMES.en}
      onChange={changeLanguageHandler}
    />

  )
}

export default LanguageSettings
