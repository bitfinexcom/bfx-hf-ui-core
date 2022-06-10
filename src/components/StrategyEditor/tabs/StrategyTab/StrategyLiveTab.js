import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StrategyPerfomanceMetrics from '../../../StrategyPerfomanceMetrics'
import StrategyTradesTable from '../../../StrategyTradesTable'
import StrategiesGridLayout from '../../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
  LAYOUT_CONFIG_WITHOUT_TRADES,
} from '../../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../../StrategyLiveChart'
import StrategyTabWrapper from '../../components/StrategyTabWrapper'
import StrategyOptionsPanelLive from '../../../StrategyOptionsPanel/StrategyOptionsPanel.Live'
import { getCurrentStrategyExecutionState } from '../../../../redux/selectors/ws'

const StrategyLiveTab = (props) => {
  const { onCancelProcess } = props
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const executionState = useSelector(getCurrentStrategyExecutionState)

  const { t } = useTranslation()

  const {
    loading, executing, results, startedOn,
  } = executionState

  const hasResults = !_isEmpty(results)

  useEffect(() => {
    if (!executing && !hasResults) {
      setLayoutConfig(LAYOUT_CONFIG_NO_DATA)
      return
    }
    if (_isEmpty(results.strategy?.trades)) {
      setLayoutConfig(LAYOUT_CONFIG_WITHOUT_TRADES)
      return
    }
    setLayoutConfig(LAYOUT_CONFIG)
  }, [hasResults, results, executing])

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return (
            <StrategyOptionsPanelLive
              {...props}
              setFullScreenChart={() => setFullScreenChart(true)}
              isExecuting={executing}
              hasResults={hasResults}
            />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return (
            <StrategyLiveChart
              {...props}
              fullscreenChart={fullscreenChart}
              exitFullscreenChart={() => setFullScreenChart(false)}
            />
          )

        case COMPONENTS_KEYS.STRATEGY_PERFOMANCE:
          return (
            <StrategyPerfomanceMetrics
              results={results}
              isExecuting={executing}
              startedOn={startedOn}
            />
          )

        case COMPONENTS_KEYS.STRATEGY_TRADES:
          return (
            <StrategyTradesTable
              results={results}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              onTradeClick={() => {}}
            />
          )

        default:
          return null
      }
    },
    [
      layoutConfig,
      props,
      fullscreenChart,
      executing,
      results,
      hasResults,
      startedOn,
    ],
  )

  return (
    <StrategyTabWrapper>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
        isLoading={loading}
        onCancelProcess={onCancelProcess}
      />
      {_isEmpty(results) && !executing && !loading && (
        <p className='hfui-strategyeditor__initial-message'>
          {t('strategyEditor.liveExecution.initialMessage')}
        </p>
      )}
    </StrategyTabWrapper>
  )
}

StrategyLiveTab.propTypes = {
  onCancelProcess: PropTypes.func.isRequired,
}

export default StrategyLiveTab
