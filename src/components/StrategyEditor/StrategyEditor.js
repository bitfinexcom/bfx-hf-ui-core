import React, { memo, useState, useEffect } from 'react'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _keys from 'lodash/keys'
import _forEach from 'lodash/forEach'
import _size from 'lodash/size'
import _find from 'lodash/find'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'

import { saveAsJSON, readJSONFile } from '../../util/ui'
import Markdown from '../../ui/Markdown'
import { THEMES } from '../../redux/selectors/ui'
import { MAX_STRATEGY_LABEL_LENGTH } from '../../constants/variables'
import Templates from './templates'
import StrategyEditorPanel from './components/StrategyEditorPanel'
import CreateNewStrategyModal from '../../modals/Strategy/CreateNewStrategyModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import OpenExistingStrategyModal from '../../modals/Strategy/OpenExistingStrategyModal'
import EmptyContent from './components/StrategyEditorEmpty'
import StrategyTab from './tabs/StrategyTab'
import IDETab from './tabs/IDETab'

import './style.css'

const DocsPath = require('bfx-hf-strategy/docs/api.md')

const debug = Debug('hfui-ui:c:strategy-editor')

const StrategyEditor = (props) => {
  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [createNewStrategyModalOpen, setCreateNewStrategyModalOpen] = useState(false)
  const [openExistingStrategyModalOpen, setOpenExistingStrategyModalOpen] = useState(false)
  const [docsText, setDocsText] = useState('')

  const {
    moveable,
    removeable,
    strategyId,
    onRemove,
    authToken,
    onStrategyChange,
    gaCreateStrategy,
    strategyContent,
    backtestResults,
    liveExecuting,
    liveLoading,
    strategyDirty,
    setStrategyDirty,
    setSectionErrors,
    onDefineIndicatorsChange,
    selectStrategy,
    setStrategy,
    strategy,
    onSaveStrategy,
    onLoadStrategy,
  } = props

  useEffect(() => {
    // load readme docs (DocsPath is an object when running in electron window)
    const docsPath = typeof DocsPath === 'object' ? DocsPath.default : DocsPath
    fetch(docsPath)
      .then((response) => response.text())
      .then(setDocsText)
  }, [])

  const onCreateNewStrategy = (label, templateLabel, content = {}) => {
    const newStrategy = { label, ...content }
    const template = _find(Templates, (_t) => _t.label === templateLabel)

    if (!template) {
      debug('unknown template: %s', templateLabel)
    }

    const templateSections = _keys(template)

    _forEach(templateSections, (s) => {
      if (s === 'label') return

      newStrategy[s] = template[s]
    })

    setSectionErrors({})
    setStrategyDirty(true)
    selectStrategy(newStrategy)

    if (newStrategy.defineIndicators) {
      onDefineIndicatorsChange(newStrategy.defineIndicators)
    }
  }

  const onCloseModals = () => {
    setOpenExistingStrategyModalOpen(false)
    setCreateNewStrategyModalOpen(false)
    setIsRemoveModalOpened(false)
  }

  const onRemoveStrategy = () => {
    const { id = strategyId } = strategy
    onCloseModals()
    onRemove(authToken, id)
    setStrategy(null)
    onStrategyChange(null)
  }

  const onExportStrategy = () => {
    const { label } = strategyContent
    saveAsJSON(strategyContent, label)
  }

  const onImportStrategy = async () => {
    try {
      const newStrategy = await readJSONFile()
      if (
        'label' in newStrategy
        && _size(newStrategy.label) < MAX_STRATEGY_LABEL_LENGTH
      ) {
        delete newStrategy.id
        onCreateNewStrategy(newStrategy.label, null, newStrategy)
      }
    } catch (e) {
      debug('Error while importing strategy: %s', e)
    }
  }

  return (
    <>
      {!strategy || _isEmpty(strategy) ? (
        <EmptyContent
          openCreateNewStrategyModal={() => setCreateNewStrategyModalOpen(true)}
        />
      ) : (
        <StrategyEditorPanel
          onRemove={onRemove}
          moveable={moveable}
          removeable={removeable}
          execRunning={
            backtestResults.executing
            || backtestResults.loading
            || liveExecuting
            || liveLoading
          }
          strategyDirty={strategyDirty}
          strategy={strategy}
          // strategies={strategies}
          strategyId={strategyId}
          onOpenSelectModal={() => setOpenExistingStrategyModalOpen(true)}
          onOpenCreateModal={() => setCreateNewStrategyModalOpen(true)}
          onOpenRemoveModal={() => setIsRemoveModalOpened(true)}
          onSaveStrategy={onSaveStrategy}
          onRemoveStrategy={onRemoveStrategy}
          onExportStrategy={onExportStrategy}
          onImportStrategy={onImportStrategy}
        >
          <StrategyTab
            sbtitle='Strategy'
            sbicon={<Icon name='file-code-o' />}
          />
          <IDETab
            sbtitle='View in IDE'
            sbicon={<Icon name='edit' />}
            {...props}
          />
          <Markdown
            sbtitle='Help'
            sbicon={<Icon name='question-circle-o' />}
            text={docsText}
          />
        </StrategyEditorPanel>
      )}
      <CreateNewStrategyModal
        isOpen={createNewStrategyModalOpen}
        gaCreateStrategy={gaCreateStrategy}
        onClose={onCloseModals}
        onSubmit={onCreateNewStrategy}
      />
      <OpenExistingStrategyModal
        isOpen={openExistingStrategyModalOpen}
        onClose={onCloseModals}
        onOpen={onLoadStrategy}
      />
      <RemoveExistingStrategyModal
        isOpen={isRemoveModalOpened}
        onClose={onCloseModals}
        onRemoveStrategy={onRemoveStrategy}
        strategy={strategy}
      />
    </>
  )
}

StrategyEditor.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  strategyId: PropTypes.string,
  renderResults: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  onStrategyChange: PropTypes.func.isRequired,
  onStrategySelect: PropTypes.func.isRequired,
  gaCreateStrategy: PropTypes.func.isRequired,
  onIndicatorsChange: PropTypes.func.isRequired,
  clearBacktestOptions: PropTypes.func.isRequired,
  liveExecuting: PropTypes.bool.isRequired,
  liveLoading: PropTypes.bool.isRequired,
  strategyContent: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.oneOf([null]).isRequired,
    ]),
  ),
  backtestResults: PropTypes.objectOf(PropTypes.any),
  settingsTheme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
}

StrategyEditor.defaultProps = {
  strategyId: '',
  moveable: false,
  removeable: false,
  renderResults: true,
  strategyContent: {},
  backtestResults: {},
  settingsTheme: THEMES.DARK,
}

export default memo(StrategyEditor)
