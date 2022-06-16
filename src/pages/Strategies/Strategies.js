import React, {
  lazy, Suspense, useState,
} from 'react'
import Debug from 'debug'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'
import _ from 'lodash'
import _values from 'lodash/values'
import _map from 'lodash/map'
// import _remove from 'lodash/remove'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import Indicators from 'bfx-hf-indicators'
import { nonce } from 'bfx-api-node-util'
import HFS from 'bfx-hf-strategy'
import HFU from 'bfx-hf-util'
import { useTranslation } from 'react-i18next'
import {
  STEPS, ACTIONS, EVENTS, STATUS,
} from '../../components/Joyride'
import Layout from '../../components/Layout'
import useTourGuide from '../../hooks/useTourGuide'
import SaveUnsavedChangesModal from '../../modals/Strategy/SaveUnsavedChangesModal'
import RemoveExistingStrategyModal from '../../modals/Strategy/RemoveExistingStrategyModal'
import SaveStrategyAsModal from '../../modals/Strategy/SaveStrategyAsModal/SaveStrategyAsModal'
import { getDefaultStrategyOptions } from '../../components/StrategyEditor/StrategyEditor.helpers'
import ClearBacktestResultsModal from '../../modals/Strategy/ClearBacktestResultsModal'

import './style.css'

const debug = Debug('hfui-ui:p:strategy-editor')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const Joyride = lazy(() => import('../../components/Joyride'))
const StrategiesListTable = lazy(() => import('../../components/StrategiesListTable'))

const StrategiesPage = ({
  finishGuide,
  firstLogin,
  isGuideActive,
  authToken,
  onSave,
  onRemove,
  backtestResults: { finished },
  strategy,
  setStrategy,
}) => {
  const [IDEcontent, setIDEcontent] = useState({})

  const [indicators, setIndicators] = useState([])
  const [strategyDirty, setStrategyDirty] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [sectionErrors, setSectionErrors] = useState({})
  const [isUnsavedStrategyModalOpen, setIsUnsavedStrategyModalOpen] = useState(false)
  const [isRemoveModalOpened, setIsRemoveModalOpened] = useState(false)
  const [isSaveStrategyAsModalOpen, setIsSaveStrategyAsModalOpen] = useState(false)
  const [isRenameStrategyModalOpen, setIsRenameStrategyModalOpen] = useState(false)
  const [isClearBacktestResultsModalOpen, setIsClearBacktestResultsOpen] = useState(false)
  const [actionStrategy, setActionStrategy] = useState({})
  const [nextStrategyToOpen, setNextStrategyToOpen] = useState(null)

  const showGuide = useTourGuide(isGuideActive)

  const { t } = useTranslation()

  // const onAddIndicator = (indicator) => {
  //   setIndicators([...indicators, indicator])
  // }

  // const onDeleteIndicator = (index) => {
  //   setIndicators(_remove(indicators, (el, id) => id !== index))
  // }

  const onIndicatorsChange = (updatedIndicators) => {
    const newIndicators = _map(_values(updatedIndicators), (ind) => {
      let colors = []

      for (let i = 0; i < 5; i += 1) {
        colors.push(randomColor())
      }

      // allow users to overwrite colors
      if (ind.color) {
        colors[0] = ind.color
      } else if (ind.colors) {
        colors = ind.colors; // eslint-disable-line
      }

      return [ind.constructor, ind._args, colors]
    })

    setIndicators(newIndicators)
  }

  const setSectionError = (section, error) => {
    setSectionErrors({
      ...sectionErrors,
      [section]: error,
    })
  }

  const clearSectionError = (section) => {
    setSectionError(section, '')
  }

  const processSectionError = (section, e) => {
    if (e.lineNumber && e.columnNumber) {
      // currently it's a non-standard property supported by Firefox only :(
      setSectionError(
        section,
        `Line ${e.lineNumber}:${e.columnNumber}: ${e.message}`,
      )
    } else {
      setSectionError(section, e.message)
    }
  }

  const evalSectionContent = (section, providedContent) => {
    const content = providedContent || strategy[section] || ''

    if (section.substring(0, 6) === 'define') {
      try {
        const func = eval(content); // eslint-disable-line
        clearSectionError(section)
        return func
      } catch (e) {
        processSectionError(section, e)
        return null
      }
    } else if (section.substring(0, 2) === 'on') {
      try {
        const func = eval(content)({ HFS, HFU, _ }); // eslint-disable-line
        clearSectionError(section)
        return func
      } catch (e) {
        processSectionError(section, e)
        return null
      }
    } else {
      debug('unrecognised section handler prefix: %s', section)
      return null
    }
  }

  const onDefineIndicatorsChange = (content) => {
    const indicatorFunc = evalSectionContent('defineIndicators', content)
    let strategyIndicators = {}

    if (indicatorFunc) {
      try {
        strategyIndicators = indicatorFunc(Indicators)
      } catch (e) {
        processSectionError('defineIndicators', e)
      }
    }

    _forEach(_values(strategyIndicators), (i) => {
      i.key = `${nonce()}`; // eslint-disable-line
    })

    onIndicatorsChange(strategyIndicators)
  }

  const onTourUpdate = (data) => {
    const {
      status, action, index, type,
    } = data
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]
    const CLOSE = 'close'

    // eslint-disable-next-line lodash/prefer-lodash-method
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setTourStep(index + (action === ACTIONS.PREV ? -1 : 1))
      // eslint-disable-next-line lodash/prefer-lodash-method
    } else if (finishedStatuses.includes(status) || action === CLOSE) {
      finishGuide()
    }
  }

  const onLoadStrategy = (newStrategy, forcedLoad = false) => {
    // const updated = { ...newStrategy, savedTs: Date.now() }
    const strategyToLoad = { ...newStrategy }
    if (strategyDirty && !forcedLoad) {
      setNextStrategyToOpen(strategyToLoad)
      setIsUnsavedStrategyModalOpen(true)
      return
    }
    if (finished && !forcedLoad) {
      setNextStrategyToOpen(strategyToLoad)
      setIsClearBacktestResultsOpen(true)
      return
    }
    if (!_isEmpty(strategyToLoad) && _isEmpty(strategyToLoad.strategyOptions)) {
      strategyToLoad.strategyOptions = getDefaultStrategyOptions()
    }
    setStrategy(strategyToLoad)
    setSectionErrors({})
    setNextStrategyToOpen(null)
    setStrategyDirty(false)
    setIDEcontent(strategyToLoad.strategyContent)

    if (strategyToLoad?.strategyContent?.defineIndicators) {
      onDefineIndicatorsChange(strategyToLoad.strategyContent.defineIndicators)
    }
  }

  const saveStrategy = (content) => {
    onSave(authToken, { ...content, strategyContent: IDEcontent, savedTs: Date.now() })
  }

  const onCloseModals = () => {
    setActionStrategy({})
    setIsRemoveModalOpened(false)
    setIsSaveStrategyAsModalOpen(false)
    setIsRenameStrategyModalOpen(false)
    setIsClearBacktestResultsOpen(false)
    setIsUnsavedStrategyModalOpen(false)
  }

  const removeStrategy = () => {
    const { id } = actionStrategy
    onRemove(authToken, id)
    onCloseModals()
  }

  const saveAsStrategy = (updatedStrategy) => {
    onSave(authToken, { ...updatedStrategy, savedTs: Date.now() })
    onCloseModals()
  }

  const renameStrategy = ({ label }) => {
    onSave(authToken, { ...actionStrategy, label, savedTs: Date.now() })
    onCloseModals()
  }

  const saveAsHandler = (rowData) => {
    setActionStrategy(rowData)
    setIsSaveStrategyAsModalOpen(true)
  }

  const renameStrategyHandler = (rowData) => {
    setActionStrategy(rowData)
    setIsRenameStrategyModalOpen(true)
  }

  const strategyRemoveHandler = (rowData) => {
    setActionStrategy(rowData)
    setIsRemoveModalOpened(true)
  }

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex className='hfui-strategyeditorpage1'>
        <Suspense fallback={<></>}>
          <StrategyEditor
            dark
            key='editor'
            onIndicatorsChange={onIndicatorsChange}
            onLoadStrategy={onLoadStrategy}
            strategyDirty={strategyDirty}
            setStrategyDirty={setStrategyDirty}
            sectionErrors={sectionErrors}
            strategy={strategy}
            setStrategy={setStrategy}
            setSectionErrors={setSectionErrors}
            onDefineIndicatorsChange={onDefineIndicatorsChange}
            evalSectionContent={evalSectionContent}
            saveStrategy={saveStrategy}
            moveable={false}
            indicators={indicators}
            removeable={false}
            IDEcontent={IDEcontent}
            setIDEcontent={setIDEcontent}
          />
        </Suspense>
        {firstLogin && (
          <Suspense fallback={<></>}>
            <Joyride
              steps={STEPS.getStrategyEditorModes(t)}
              callback={onTourUpdate}
              run={showGuide}
              stepIndex={tourStep}
            />
          </Suspense>
        )}
        <StrategiesListTable
          onLoadStrategy={onLoadStrategy}
          onStrategyRemove={strategyRemoveHandler}
          saveAsHandler={saveAsHandler}
          renameStrategy={renameStrategyHandler}
        />
        <SaveUnsavedChangesModal
          isOpen={isUnsavedStrategyModalOpen}
          onClose={onCloseModals}
          strategy={strategy}
          nextStrategy={nextStrategyToOpen}
          onLoadStrategy={onLoadStrategy}
          saveStrategy={saveStrategy}
        />
        <SaveStrategyAsModal
          isOpen={isSaveStrategyAsModalOpen}
          onClose={onCloseModals}
          strategy={actionStrategy}
          onSubmit={saveAsStrategy}
        />
        <SaveStrategyAsModal
          isOpen={isRenameStrategyModalOpen}
          onClose={onCloseModals}
          strategy={actionStrategy}
          onSubmit={renameStrategy}
        />
        <RemoveExistingStrategyModal
          isOpen={isRemoveModalOpened}
          onClose={onCloseModals}
          onRemoveStrategy={removeStrategy}
          strategy={actionStrategy}
        />
        <ClearBacktestResultsModal
          isOpen={isClearBacktestResultsModalOpen}
          onClose={onCloseModals}
          nextStrategy={nextStrategyToOpen}
          onLoadStrategy={onLoadStrategy}
        />
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

StrategiesPage.propTypes = {
  firstLogin: PropTypes.bool,
  isGuideActive: PropTypes.bool,
  finishGuide: PropTypes.func.isRequired,
  setStrategy: PropTypes.func.isRequired,
  strategy: PropTypes.objectOf(Object).isRequired,
  authToken: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  backtestResults: PropTypes.shape({
    finished: PropTypes.bool,
  }).isRequired,
}

StrategiesPage.defaultProps = {
  firstLogin: false,
  isGuideActive: true,
}

export default StrategiesPage
