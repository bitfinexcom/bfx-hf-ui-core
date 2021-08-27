import Editor, { useMonaco } from '@monaco-editor/react'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'

const HF_MONACO_THEME = 'HFTheme'

const MonacoEditor = ({ value, onChange }) => {
  const monaco = useMonaco()
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

  return (
    <Editor
      language='javascript'
      value={value}
      onChange={onChange}
      height='100%'
      width='100%'
      theme={HF_MONACO_THEME}
    />
  )
}

MonacoEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MonacoEditor
