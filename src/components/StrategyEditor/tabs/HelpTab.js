import React, { useEffect, useState } from 'react'
import Markdown from '../../../ui/Markdown'

const DocsPath = require('bfx-hf-strategy/docs/api.md')

const HelpTab = () => {
  const [docsText, setDocsText] = useState('')

  useEffect(() => {
    // load readme docs (DocsPath is an object when running in electron window)
    const docsPath = typeof DocsPath === 'object' ? DocsPath.default : DocsPath
    fetch(docsPath)
      .then((response) => response.text())
      .then(setDocsText)
  }, [])

  return <Markdown text={docsText} />
}

export default HelpTab
