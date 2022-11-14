import Editor, { monaco } from '@blaumaus/react-monaco-editor'
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { THEMES } from '../../../redux/selectors/ui'

const HF_MONACO_THEME = 'HFTheme'
const getMonacoOptions = (readOnly) => ({
  automaticLayout: true,
  readOnly,
})

const MonacoEditor = ({
  value, onChange, theme, readOnly,
}) => {
  const monacoOptions = useMemo(() => getMonacoOptions(readOnly), [readOnly])

  const onEditorChangeHandler = (e) => {
    if (readOnly) {
      return
    }
    onChange(e)
  }
  useEffect(() => {
    if (_isEmpty(monaco)) {
      return
    }
    monaco.editor.defineTheme(HF_MONACO_THEME, {
      base: 'vs-dark',
      inherit: true,
      rules: [{ background: '172d3e' }],
      colors: {
        'editor.background': '#172d3e',
      },
    })
    monaco.editor.setTheme(HF_MONACO_THEME)
  }, [])

  useEffect(() => {
    monaco.editor.setTheme(theme === THEMES.DARK ? HF_MONACO_THEME : 'vs')
  }, [theme])

  return (
    <Editor
      height='100%'
      width='100%'
      language='javascript'
      theme={theme === THEMES.DARK ? HF_MONACO_THEME : 'vs'}
      value={value}
      onChange={onEditorChangeHandler}
      options={monacoOptions}
    />
  )
}

MonacoEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default MonacoEditor
