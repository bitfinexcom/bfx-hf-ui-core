import React, {
  lazy, Suspense, useState, memo, useMemo,
} from 'react'
import Debug from 'debug'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'
import _ from 'lodash'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _remove from 'lodash/remove'
import _size from 'lodash/size'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import Indicators from 'bfx-hf-indicators'
import { nonce } from 'bfx-api-node-util'
import HFS from 'bfx-hf-strategy'
import HFU from 'bfx-hf-util'
import { useTranslation } from 'react-i18next'
import ClassNames from 'clsx'

import {
  STEPS, ACTIONS, EVENTS, STATUS,
} from '../../components/Joyride'
import Layout from '../../components/Layout'
import Panel from '../../ui/Panel'
import useTourGuide from '../../hooks/useTourGuide'

import './style.css'
import GridLayout from '../../components/GridLayout'

const debug = Debug('hfui-ui:p:strategy-editor')

const StrategyEditor = lazy(() => import('../../components/StrategyEditor'))
const Joyride = lazy(() => import('../../components/Joyride'))

// todo: move 'export strategy' to the options tab

const StrategyEditorPage = ({
  selectStrategy, finishGuide, setStrategyContent, firstLogin, isGuideActive, strategyContent, setStrategyTab, selectedTab, strategies,
  onSave, authToken,
}) => {
  const [strategy, setStrategy] = useState(strategyContent)
  const [indicators, setIndicators] = useState([])
  const [strategyDirty, setStrategyDirty] = useState(false)
  const [forcedTab, setForcedTab] = useState(selectedTab)
  const [tourStep, setTourStep] = useState(0)
  const [sectionErrors, setSectionErrors] = useState({})

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
        colors = ind.colors // eslint-disable-line
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
      setSectionError(section, `Line ${e.lineNumber}:${e.columnNumber}: ${e.message}`)
    } else {
      setSectionError(section, e.message)
    }
  }

  const evalSectionContent = (section, providedContent) => {
    const content = providedContent || strategy[section] || ''

    if (section.substring(0, 6) === 'define') {
      try {
        const func = eval(content) // eslint-disable-line
        clearSectionError(section)
        return func
      } catch (e) {
        processSectionError(section, e)
        return null
      }
    } else if (section.substring(0, 2) === 'on') {
      try {
        const func = eval(content)({ HFS, HFU, _ }) // eslint-disable-line
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
      i.key = `${nonce()}` // eslint-disable-line
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

  const onLoadStrategy = (newStrategy) => {
    const updated = { ...newStrategy, savedTs: Date.now() }
    onSave(authToken, updated)
    setStrategy(updated)
    setSectionErrors({})
    setStrategyDirty(false)
    selectStrategy(newStrategy)

    if (newStrategy.defineIndicators) {
      onDefineIndicatorsChange(newStrategy.defineIndicators)
    }
  }

  const onSaveStrategy = () => {
    onSave(authToken, { ...strategy, savedTs: Date.now() })
    setStrategyDirty(false)
    // onCloseModals()
  }

  const selectStrategyHandler = (content) => {
    selectStrategy()
    setContent(content)
  }

  const strategyNodesArray = useMemo(() => {
    return _map(strategies, (str, index) => {
      // if (index >= 6) {
      //   return null
      // }
      return (
        <li
          key={str.id}
          className='strategy-item'
          onClick={() => onLoadStrategy(str)}
        >
          {str.label}
        </li>
      )
    })
  }, [strategies])

  // console.log(strategyContent, strategy)

  return (
    <Layout>
      <Layout.Header />
      <Layout.Main flex className='hfui-strategyeditorpage1'>
        <GridLayout sharedProps={{
          onLoadStrategy,
          results: {
            vol: 0,
            fees: 0,
            candles: [
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648458000000,
                open: 46939,
                close: 46939,
                high: 46939,
                low: 34000,
                volume: 0.00090151,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648461600000,
                open: 46939,
                close: 46939,
                high: 46939,
                low: 46939,
                volume: 0.00056146,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648465200000,
                open: 46939,
                close: 34000,
                high: 46939,
                low: 34000,
                volume: 0.00094376,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648468800000,
                open: 46939,
                close: 34000,
                high: 46939,
                low: 34000,
                volume: 0.0008742400000000001,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648472400000,
                open: 46939,
                close: 34000,
                high: 47000,
                low: 34000,
                volume: 0.03120467,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648476000000,
                open: 47000,
                close: 47000,
                high: 47000,
                low: 34000,
                volume: 0.00086265,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648479600000,
                open: 34000,
                close: 34000,
                high: 47000,
                low: 34000,
                volume: 0.15089387,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648483200000,
                open: 47000,
                close: 34000,
                high: 47000,
                low: 34000,
                volume: 0.00294492,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: null, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648486800000,
                open: 47000,
                close: 47000,
                high: 47000,
                low: 34000,
                volume: 0.00084373,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 0, signal: 0, divergence: 0 } },
              },
              {
                _events: {},
                _eventsCount: 0,
                emptyFill: null,
                _fields: {
                  mts: 0, open: 1, close: 2, high: 3, low: 4, volume: 5,
                },
                _boolFields: [],
                mts: 1648490400000,
                open: 34000,
                close: 47000,
                high: 47000,
                low: 34000,
                volume: 0.00040983,
                tf: '1h',
                symbol: 'tTESTBTC:TESTUSD',
                iv: { macd: { macd: 40487.8, signal: 8097.56, divergence: 32390.24 } },
              },
            ],
            trades: [],
            nTrades: 0,
            nCandles: 10,
            nStrategyTrades: 0,
            nOpens: 0,
            nGains: 0,
            nLosses: 0,
            stdDeviation: 0,
            pl: 0,
            pf: 0,
            avgPL: 0,
            minPL: 0,
            maxPL: 0,
            strategy: { trades: [] },
          },

        }}
        />
        {/* <StrategyEditor
            dark
            onStrategySelect={selectStrategyHandler}
            selectStrategy={selectStrategy}
            onStrategyChange={setContent}
            key='editor'
            onIndicatorsChange={onIndicatorsChange}
            onLoadStrategy={onLoadStrategy}
            onSaveStrategy={onSaveStrategy}
            strategyDirty={strategyDirty}
            setStrategyDirty={setStrategyDirty}
            sectionErrors={sectionErrors}
            strategyContent={strategyContent}
            strategy={strategy}
            setStrategy={setStrategy}
            setSectionErrors={setSectionErrors}
            onDefineIndicatorsChange={onDefineIndicatorsChange}
            evalSectionContent={evalSectionContent}
            moveable={false}
            removeable={false}
            indicators={indicators}
            onAddIndicator={onAddIndicator}
            onDeleteIndicator={onDeleteIndicator}
          /> */}
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
        {/* <div
          key='main'
          className={ClassNames('hfui-strategyeditorpage__list', { initial: _isEmpty(strategy) })}
        >
          <Panel
            moveable={false}
            removeable={false}
            forcedTab={forcedTab}
            onTabChange={setStrategyTab}
            darkHeader
          >
            <div tabtitle={t('strategyEditor.activeStrategies', { amount: 0 })}>
              {null}
            </div>
            <ul className='strategies-list' tabtitle={t('strategyEditor.pastStrategies', { amount: _size(strategyNodesArray) })}>
              {strategyNodesArray}
            </ul>
          </Panel>
        </div> */}
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

StrategyEditorPage.propTypes = {
  // dark: PropTypes.bool,
  firstLogin: PropTypes.bool,
  isGuideActive: PropTypes.bool,
  finishGuide: PropTypes.func.isRequired,
  selectStrategy: PropTypes.func.isRequired,
  setStrategyContent: PropTypes.func.isRequired,
  setStrategyTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.number,
  strategyContent: PropTypes.objectOf(Object),
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
}

StrategyEditorPage.defaultProps = {
  // dark: true,
  firstLogin: false,
  isGuideActive: true,
  strategyContent: {},
  selectedTab: null,
}

export default memo(StrategyEditorPage)
