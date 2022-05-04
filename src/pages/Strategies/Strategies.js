import React, {
  lazy, Suspense, useState,
} from 'react'
import Debug from 'debug'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'
import _ from 'lodash'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _remove from 'lodash/remove'
import _forEach from 'lodash/forEach'
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

import './style.css'

const debug = Debug('hfui-ui:p:strategy-editor')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const Joyride = lazy(() => import('../../components/Joyride'))
const StrategiesListTable = lazy(() => import('../../components/StrategiesListTable'))

const StrategiesPage = ({
  selectStrategy,
  finishGuide,
  setStrategyContent,
  firstLogin,
  isGuideActive,
  strategyContent,
  authToken,
  onSave,
}) => {
  const [strategy, setStrategy] = useState(strategyContent)
  const [indicators, setIndicators] = useState([])
  const [strategyDirty, setStrategyDirty] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [sectionErrors, setSectionErrors] = useState({})
  const [isUnsavedStrategyModalOpen, setIsUnsavedStrategyModalOpen] = useState(false)
  const [nextStrategyToOpen, setNextStrategyToOpen] = useState(null)

  const showGuide = useTourGuide(isGuideActive)

  const { t } = useTranslation()

  const onAddIndicator = (indicator) => {
    setIndicators([...indicators, indicator])
  }

  const onDeleteIndicator = (index) => {
    setIndicators(_remove(indicators, (el, id) => id !== index))
  }

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

  const selectStrategyHandler = (content) => {
    selectStrategy()
    setStrategyContent(content)
    setStrategy(content)
  }

  const onLoadStrategy = (newStrategy, forcedLoad = false) => {
    // const updated = { ...newStrategy, savedTs: Date.now() }
    if (strategyDirty && !forcedLoad) {
      setNextStrategyToOpen(newStrategy)
      setIsUnsavedStrategyModalOpen(true)
      return
    }
    selectStrategyHandler(newStrategy, forcedLoad)
    setSectionErrors({})
    setStrategyDirty(false)

    if (newStrategy.defineIndicators) {
      onDefineIndicatorsChange(newStrategy.defineIndicators)
    }
  }

  const saveStrategy = (content) => {
    onSave(authToken, { ...content, savedTs: Date.now() })
  }

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex className='hfui-strategyeditorpage1'>
        <Suspense fallback={<></>}>
          <StrategyEditor
            dark
            onStrategySelect={selectStrategyHandler}
            selectStrategy={selectStrategy}
            onStrategyChange={setStrategyContent}
            key='editor'
            onIndicatorsChange={onIndicatorsChange}
            onLoadStrategy={onLoadStrategy}
            strategyDirty={strategyDirty}
            setStrategyDirty={setStrategyDirty}
            sectionErrors={sectionErrors}
            strategyContent={strategyContent}
            strategy={strategy}
            setStrategy={setStrategy}
            setSectionErrors={setSectionErrors}
            onDefineIndicatorsChange={onDefineIndicatorsChange}
            evalSectionContent={evalSectionContent}
            saveStrategy={saveStrategy}
            moveable={false}
            indicators={indicators}
            removeable={false}
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
        <StrategiesListTable onLoadStrategy={onLoadStrategy} />
        <SaveUnsavedChangesModal
          isOpen={isUnsavedStrategyModalOpen}
          onClose={() => setIsUnsavedStrategyModalOpen(false)}
          strategy={strategy}
          nextStrategy={nextStrategyToOpen}
          onLoadStrategy={onLoadStrategy}
          saveStrategy={saveStrategy}
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
  selectStrategy: PropTypes.func.isRequired,
  setStrategyContent: PropTypes.func.isRequired,
  strategyContent: PropTypes.objectOf(Object),
  authToken: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
}

StrategiesPage.defaultProps = {
  firstLogin: false,
  isGuideActive: true,
  strategyContent: {},
}

export default StrategiesPage
