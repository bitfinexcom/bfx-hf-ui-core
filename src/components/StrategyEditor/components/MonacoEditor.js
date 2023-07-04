import Editor, { useMonaco } from '@monaco-editor/react'
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

import { THEMES } from '../../../redux/selectors/ui'

const HF_MONACO_THEME = 'HFTheme'
const getMonacoOptions = (readOnly) => ({
  automaticLayout: true,
  readOnly,
  domReadOnly: readOnly,
})

const MonacoEditor = ({
  value, onChange, theme, readOnly, activeContent,
}) => {
  const monacoOptions = useMemo(() => getMonacoOptions(readOnly), [readOnly])
  const monaco = useMonaco()

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
  }, [monaco])

  useEffect(() => {
    if (_isEmpty(monaco)) {
      return
    }
    monaco.editor.setTheme(theme === THEMES.DARK ? HF_MONACO_THEME : 'light')
  }, [theme, monaco])

  return (
    <Editor
      height='100%'
      width='100%'
      language='javascript'
      theme={theme === THEMES.DARK ? HF_MONACO_THEME : 'light'}
      value={value}
      path={activeContent}
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
  activeContent: PropTypes.string.isRequired,
}

export default MonacoEditor
