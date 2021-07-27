import React, {
  lazy, Suspense, useState, useEffect, memo,
} from 'react'
import _values from 'lodash/values'
import randomColor from 'randomcolor'
import PropTypes from 'prop-types'
import _remove from 'lodash/remove'
import { STEPS, STATUS } from '../../components/Joyride'
import Layout from '../../components/Layout'
import Panel from '../../ui/Panel'
import Markdown from '../../ui/Markdown'
import Backtester from '../../components/Backtester'
// import LiveStrategyExecutor from '../../components/LiveStrategyExecutor'
import './style.css'

const DocsPath = require('bfx-hf-strategy/docs/api.md')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const Joyride = lazy(() => import('../../components/Joyride'))

const StrategyEditorPage = (props) => {
  const {
    selectStrategy, finishGuide, setStrategyContent, firstLogin, isGuideActive, // strategyContent,
  } = props
  const [indicators, setIndicators] = useState([])
  const [docsText, setDocsText] = useState('')
  const [forcedTab, setForcedTab] = useState('')

  useEffect(() => {
    // load readme docs (DocsPath is an object when running in electron window)
    const docsPath = typeof DocsPath === 'object' ? DocsPath.default : DocsPath
    fetch(docsPath)
      .then(response => response.text())
      .then(setDocsText)
  }, [])

  const onAddIndicator = (indicator) => {
    setIndicators([...indicators, indicator])
  }

  const onDeleteIndicator = (index) => {
    setIndicators(_remove(indicators, (_, id) => id !== index))
  }

  const onIndicatorsChange = (updatedIndicators) => {
    const newIndicators = _values(updatedIndicators).map((ind) => {
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

  const onGuideFinish = ({ status, action }) => {
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]
    const CLOSE = 'close'
    if (finishedStatuses.includes(status) || action === CLOSE) {
      finishGuide()
    }
  }

  const setContent = (content) => {
    setForcedTab('Backtest')
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
                steps={STEPS.STRATEGY_EDITOR}
                callback={onGuideFinish}
                run={isGuideActive}
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
              darkHeader
            >
              <Markdown
                tabtitle='Docs'
                text={docsText}
              />
              <div
                tabtitle='Backtest'
              >
                <Backtester
                  {...props}
                  indicators={indicators}
                  onAddIndicator={onAddIndicator}
                  onDeleteIndicator={onDeleteIndicator}
                />
              </div>
              {/* hidden until this feature will be implemented
                <div
                  tabtitle='Execute'
                >
                  <LiveStrategyExecutor
                    strategyContent={strategyContent}
                  />
                </div>
              */}
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
  // strategyContent: PropTypes.objectOf(Object),
}

StrategyEditorPage.defaultProps = {
  dark: true,
  firstLogin: false,
  isGuideActive: true,
  // strategyContent: {},
}

export default memo(StrategyEditorPage)
