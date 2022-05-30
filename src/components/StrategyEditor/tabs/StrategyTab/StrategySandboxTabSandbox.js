import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import StrategiesGridLayout from '../../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
  LAYOUT_CONFIG_WITHOUT_TRADES,
} from '../../components/StrategiesGridLayout.constants'
import StrategyOptionsPanel from '../../../StrategyOptionsPanel'
import StrategyTabWrapper from '../../components/StrategyTabWrapper'
import IDEPanel from '../../../IDEPanel'
import IDEHelpPanel from '../../../IDEHelpPanel'

const StrategySandboxTab = (props) => {
  const { executionResults, options } = props
  const [layoutConfig, setLayoutConfig] = useState()
  const [fullscreenChart, setFullScreenChart] = useState(false)

  const { t } = useTranslation()

  const { loading, executing, results } = executionResults

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
            <StrategyOptionsPanel
              {...props}
              setFullScreenChart={() => setFullScreenChart(true)}
              isExecuting={executing}
              hasResults={hasResults}
            />
          )

        case COMPONENTS_KEYS.IDE:
          return <IDEPanel {...props} />
        case COMPONENTS_KEYS.HELP_DOCS:
          return <IDEHelpPanel />

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
      options,
    ],
  )

  return (
    <StrategyTabWrapper>
      <StrategiesGridLayout
        layoutConfig={layoutConfig}
        renderGridComponents={renderGridComponents}
        isLoading={loading}
      />
      {_isEmpty(results) && !executing && !loading && (
        <p className='hfui-strategyeditor__initial-message'>
          {t('strategyEditor.liveExecution.initialMessage')}
        </p>
      )}
    </StrategyTabWrapper>
  )
}

StrategyTab.propTypes = {
  executionResults: PropTypes.shape({
    loading: PropTypes.bool,
    executing: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    results: PropTypes.object,
  }).isRequired,
  options: PropTypes.shape({
    startedOn: PropTypes.number,
  }).isRequired,
}

export default StrategySandboxTab
