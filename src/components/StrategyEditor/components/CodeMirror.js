import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import UIWCodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode'

import { THEMES } from '../../../redux/selectors/ui'

const codeMirrorBasicSetup = {
  crosshairCursor: false,
}

const codeMirrorExtensions = [javascript({ jsx: false })]

const CodeMirror = ({
  value, onChange, editable, theme: appTheme,
}) => {
  const options = useMemo(() => {
    return {
      tabSize: 2,
      hintOptions: {
        closeOnUnfocus: true,
        completeSingle: false,
      },
    }
  }, [])
  const theme = useMemo(() => {
    return appTheme === THEMES.DARK
      ? vscodeDarkInit({
        settings: {
          background: '#172d3e',
          gutterBackground: '#172d3e',
        },
      })
      : 'light'
  }, [appTheme])

  return (
    <UIWCodeMirror
      value={value}
      onChange={onChange}
      options={options}
      theme={theme}
      extensions={codeMirrorExtensions}
      editable={editable}
      height='100%'
      basicSetup={codeMirrorBasicSetup}
      width='100%'
    />
  )
}

CodeMirror.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
}

export default memo(CodeMirror)
