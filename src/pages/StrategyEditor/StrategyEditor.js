import React, {
  lazy, Suspense, useState, useEffect, memo,
} from 'react'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _remove from 'lodash/remove'
import { useTranslation } from 'react-i18next'

import {
  STEPS, ACTIONS, EVENTS, STATUS,
} from '../../components/Joyride'
import Layout from '../../components/Layout'
import Panel from '../../ui/Panel'
import Markdown from '../../ui/Markdown'
import Backtester from '../../components/Backtester'
import { isElectronApp } from '../../redux/config'
import LiveStrategyExecutor from '../../components/LiveStrategyExecutor'
import useTourGuide from '../../hooks/useTourGuide'

import './style.css'

const DocsPath = require('bfx-hf-strategy/docs/api.md')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const Joyride = lazy(() => import('../../components/Joyride'))

const StrategyEditorPage = (props) => {
  const {
    selectStrategy, finishGuide, setStrategyContent, firstLogin, isGuideActive, strategyContent, setStrategyTab, selectedTab,
  } = props
  const [indicators, setIndicators] = useState([])
  const [docsText, setDocsText] = useState('')
  const [forcedTab, setForcedTab] = useState(selectedTab)
  const [tourStep, setTourStep] = useState(0)

  const showGuide = useTourGuide(isGuideActive)

  useEffect(() => {
    // load readme docs (DocsPath is an object when running in electron window)
    const docsPath = typeof DocsPath === 'object' ? DocsPath.default : DocsPath
    fetch(docsPath)
      .then(response => response.text())
      .then(setDocsText)
  }, [])

  const { t } = useTranslation()

  const onAddIndicator = (indicator) => {
    setIndicators([...indicators, indicator])
  }

  const onDeleteIndicator = (index) => {
    setIndicators(_remove(indicators, (_, id) => id !== index))
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
        colors = ind.colors // eslint-disable-line
      }

      return [ind.constructor, ind._args, colors]
    })

    setIndicators(newIndicators)
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

  const setContent = (content) => {
    if (content?.id) {
      // index of Backtest tab
      setForcedTab(1)
    } else {
      // index of Docs tab
      setForcedTab(0)
    }
    setStrategyContent(content)
  }

  const selectStrategyHandler = (content) => {
    selectStrategy()
    setContent(content)
  }

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main className='hfui-strategyeditorpage__wrapper'>
        <div className='hfui-strategyeditorpage__content-wrapper'>
          <Suspense fallback={<></>}>
            <StrategyEditor
              dark
              onStrategySelect={selectStrategyHandler}
              onStrategyChange={setContent}
              key='editor'
              onIndicatorsChange={onIndicatorsChange}
              moveable={false}
              removeable={false}
              tf='1m'
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
          <div
            key='main'
            className='hfui-strategiespage__right'
          >
            <Panel
              className='hfui-strategiespage__pannel-wrapper'
              moveable={false}
              removeable={false}
              forcedTab={forcedTab}
              onTabChange={setStrategyTab}
              darkHeader
            >
              <Markdown
                tabtitle={t('strategyEditor.docsTab')}
                text={docsText}
              />
              <div tabtitle={t('strategyEditor.backtestTab')}>
                <Backtester
                  {...props}
                  indicators={indicators}
                  onAddIndicator={onAddIndicator}
                  onDeleteIndicator={onDeleteIndicator}
                />
              </div>
              {isElectronApp && (
                <div tabtitle={t('strategyEditor.executeTab')}>
                  <LiveStrategyExecutor
                    strategyContent={strategyContent}
                    indicators={indicators}
                    onAddIndicator={onAddIndicator}
                    onDeleteIndicator={onDeleteIndicator}
                  />
                </div>
              )}
            </Panel>
          </div>
        </div>
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

StrategyEditorPage.propTypes = {
  dark: PropTypes.bool,
  firstLogin: PropTypes.bool,
  isGuideActive: PropTypes.bool,
  finishGuide: PropTypes.func.isRequired,
  selectStrategy: PropTypes.func.isRequired,
  setStrategyContent: PropTypes.func.isRequired,
  setStrategyTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.number,
  strategyContent: PropTypes.objectOf(Object),
}

StrategyEditorPage.defaultProps = {
  dark: true,
  firstLogin: false,
  isGuideActive: true,
  strategyContent: {},
  selectedTab: null,
}

export default memo(StrategyEditorPage)
