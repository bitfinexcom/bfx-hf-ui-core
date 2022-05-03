import React, { useEffect, useState } from 'react'
import Markdown from '../../ui/Markdown'
import Panel from '../../ui/Panel'

const DocsPath = require('bfx-hf-strategy/docs/api.md')

const IDEHelpPanel = () => {
  const [docsText, setDocsText] = useState('')

  useEffect(() => {
    // load readme docs (DocsPath is an object when running in electron window)
    const docsPath = typeof DocsPath === 'object' ? DocsPath.default : DocsPath
    fetch(docsPath)
      .then((response) => response.text())
      .then(setDocsText)
  }, [])

  return (
    <Panel moveable={false} removeable={false} darkHeader>
      <Markdown text={docsText} />
    </Panel>
  )
}

export default IDEHelpPanel
