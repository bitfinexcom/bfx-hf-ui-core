import React, { useState } from 'react'
import _keys from 'lodash/keys'
import _map from 'lodash/map'

import { useTranslation } from 'react-i18next'
import Dropdown from '../../ui/Dropdown'
import { LANGUAGE_NAMES } from '../../locales/i18n'

const languagesKeys = _keys(LANGUAGE_NAMES)
const languagesOptions = _map(languagesKeys, lang => ({ value: lang, label: LANGUAGE_NAMES[lang] }))

const LanguageSettings = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)
  const changeLanguageHandler = (lang) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }
  return (
    <Dropdown
      value={language}
      options={languagesOptions}
      placeholder={LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en}
      onChange={changeLanguageHandler}
    />

  )
}

export default LanguageSettings
