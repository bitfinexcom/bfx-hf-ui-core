import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import StrategyTradesTable from '../../StrategyTradesTable'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
  LAYOUT_CONFIG_NO_DATA,
  LAYOUT_CONFIG_WITHOUT_TRADES,
} from '../components/StrategiesGridLayout.constants'
import StrategyLiveChart from '../../StrategyLiveChart'
import StrategyOptionsPanel from '../../StrategyOptionsPanel'
import StrategyTabWrapper from '../components/StrategyTabWrapper'

import ExecutionOptionsBody from '../../../modals/Strategy/ExecutionOptionsModal/ExecutionOptionsBody'

const ExecParamsTab = (props) => {
  const { t } = useTranslation()

  return (
    <ExecutionOptionsBody t={t} />
  )
}

ExecParamsTab.propTypes = {
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

export default ExecParamsTab
