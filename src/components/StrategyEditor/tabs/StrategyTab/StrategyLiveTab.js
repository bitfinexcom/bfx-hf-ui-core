import React, {
  useMemo, useCallback, useEffect, useState,
} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
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
import useToggle from '../../../../hooks/useToggle'
import StrategyOptionsPanelLive from '../../../StrategyOptionsPanel/StrategyOptionsPanel.Live'
import { getCurrentStrategyExecutionState, getCurrentStrategyPositions } from '../../../../redux/selectors/ws'
import { prepareChartTrades } from '../../StrategyEditor.helpers'
import {
  INDICATORS_ARRAY_SHAPE,
  MARKET_SHAPE,
  STRATEGY_SHAPE,
} from '../../../../constants/prop-types-shapes'

const StrategyLiveTab = (props) => {
  const {
    strategy,
    markets,
    indicators,
    onOpenSaveStrategyAsModal,
    openExecutionOptionsModal,
    stopExecution,
    saveStrategyOptions,
    onCancelProcess,
  } = props
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, , setFullScreenChart, unsetFullScreenChart] = useToggle(false)

  const executionState = useSelector(getCurrentStrategyExecutionState)
  const positions = useSelector(getCurrentStrategyPositions)

  const {
    loading, executing, results, startedOn,
  } = executionState

  const trades = useMemo(() => prepareChartTrades(positions), [positions])

  const hasResults = !_isEmpty(results)
  const hasPositions = !_isEmpty(positions)

  useEffect(() => {
    if (!executing && !hasResults) {
      setLayoutConfig(LAYOUT_CONFIG_NO_DATA)
    } else if (!hasPositions) {
      setLayoutConfig(LAYOUT_CONFIG_WITHOUT_TRADES)
    } else {
      setLayoutConfig(LAYOUT_CONFIG)
    }
  }, [hasResults, executing, hasPositions])

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return (
            <StrategyOptionsPanelLive
              strategy={strategy}
              markets={markets}
              onOpenSaveStrategyAsModal={onOpenSaveStrategyAsModal}
              openExecutionOptionsModal={openExecutionOptionsModal}
              stopExecution={stopExecution}
              saveStrategyOptions={saveStrategyOptions}
              setFullScreenChart={setFullScreenChart}
              isExecuting={executing}
              hasResults={hasResults}
            />
          )

        case COMPONENTS_KEYS.LIVE_CHART:
          return (
            <StrategyLiveChart
              indicators={indicators}
              markets={markets}
              strategy={strategy}
              fullscreenChart={fullscreenChart}
              exitFullscreenChart={unsetFullScreenChart}
              trades={trades}
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
              results={positions}
              setLayoutConfig={setLayoutConfig}
              layoutConfig={layoutConfig}
              strategy={strategy}
            />
          )

        default:
          return null
      }
    },
    [
      markets,
      onOpenSaveStrategyAsModal,
      openExecutionOptionsModal,
      stopExecution,
      saveStrategyOptions,
      setFullScreenChart,
      executing,
      hasResults,
      indicators,
      strategy,
      fullscreenChart,
      unsetFullScreenChart,
      trades,
      results,
      startedOn,
      positions,
      layoutConfig,
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
    </StrategyTabWrapper>
  )
}

StrategyLiveTab.propTypes = {
  onCancelProcess: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  openExecutionOptionsModal: PropTypes.func.isRequired,
  stopExecution: PropTypes.func.isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
}

StrategyLiveTab.defaultProps = {
  indicators: [],
}

export default StrategyLiveTab
