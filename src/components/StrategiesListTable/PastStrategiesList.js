import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { pastStrategiesColumns } from './StrategiesList.columns'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'
import { getMarketsForExecution } from '../../redux/selectors/meta'

const PastStrategiesList = ({ onLoadStrategy, strategies, getMarketPair }) => {
  const markets = useSelector(getMarketsForExecution)
  const { t } = useTranslation()

  const prepareStrategyToLoad = ({ rowData: strategy }) => {
    const {
      strategyOpts: {
        tf,
        seedCandleCount,
        includeTrades,
        allocation,
        percStopLoss,
        maxDrawdown,
        symbol,
        ...restOpts
      },
    } = strategy

    const newOptions = {
      [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: tf,
      [STRATEGY_OPTIONS_KEYS.TRADES]: includeTrades,
      [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: seedCandleCount,
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: String(allocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LESS_PERC]: String(percStopLoss),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: String(maxDrawdown),
      [STRATEGY_OPTIONS_KEYS.SYMBOL]: _find(markets, (m) => m.wsID === symbol),
      ...restOpts,
    }

    const newStrategyObject = { ...strategy, strategyOptions: newOptions }
    delete newStrategyObject.strategyOpts
    onLoadStrategy(newStrategyObject)
  }

  return (
    <>
      {_isEmpty(strategies) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('strategyEditor.noStrategiesToDisplay')}
          </span>
        </div>
      ) : (
        <VirtualTable
          data={strategies}
          columns={pastStrategiesColumns(t, getMarketPair)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={prepareStrategyToLoad}
        />
      )}
    </>
  )
}

PastStrategiesList.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  getMarketPair: PropTypes.func.isRequired,
}

export default PastStrategiesList
