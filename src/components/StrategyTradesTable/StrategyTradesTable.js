/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {
  useEffect, memo, useState, useRef, useCallback, useMemo,
} from 'react'
import { Button, VirtualTable } from '@ufx-ui/core'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import _findIndex from 'lodash/findIndex'
import _isEmpty from 'lodash/isEmpty'
import { Icon } from 'react-fa'

import Panel from '../../ui/Panel'
import StrategyTradesTableColumns from './StrategyTradesTable.columns'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from '../StrategyEditor/components/StrategiesGridLayout.constants'
import { getRowRenderer, rowCache } from './StrategyTradesTable.Row'

import { onTradeExportClick } from './StrategyTradesTable.helpers'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const StrategyTradesTable = ({
  results,
  metrics,
  setLayoutConfig,
  layoutConfig,
  strategy,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const { strategyOptions: { symbol = {} } = {} } = strategy

  const onExpandClick = useCallback(() => {
    const currentElementIndex = _findIndex(
      layoutConfig,
      (c) => c.i === COMPONENTS_KEYS.STRATEGY_TRADES,
    )
    const currentElement = layoutConfig[currentElementIndex]
    const newElementConfig = {
      ...currentElement,
      y: 2,
      h: 7,
    }
    const newLayoutConfig = [...layoutConfig]
    newLayoutConfig[currentElementIndex] = newElementConfig
    setIsExpanded(true)
    setLayoutConfig(newLayoutConfig)
  }, [layoutConfig, setLayoutConfig])

  const onCompressClick = () => {
    setIsExpanded(false)
    setLayoutConfig(LAYOUT_CONFIG)
  }

  const { t } = useTranslation()

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const tableRef = useRef()
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.recomputeRowHeights()
    }
  },
  [tableRef, selectedIndex, isExpanded])

  const columns = StrategyTradesTableColumns(t, selectedIndex, setSelectedIndex)

  const rowRenderer = useMemo(() => getRowRenderer(selectedIndex), [selectedIndex])

  return (
    <Panel
      dark
      darkHeader
      label={t('tradesTableModal.title')}
      removeable={false}
      moveable={false}
      className='hfui-strategytradestable__wrapper'
      hideIcons
      hasShadow={isExpanded}
      preHeaderComponents={(
        <>
          <Button
            className='panel-button'
            onClick={() => onTradeExportClick(results, metrics, symbol, t, getCurrencySymbol)}
            disabled={_isEmpty(results)}
          >
            <Icon name='file' />
            &nbsp;&nbsp;
            {t('strategyEditor.exportCSV')}
          </Button>
          {isExpanded ? (
            <Button className='panel-button' onClick={onCompressClick}>
              <Icon name='compress' />
              &nbsp;&nbsp;
              <span>{t('ui.compressPanel')}</span>
            </Button>
          ) : (
            <Button className='panel-button' onClick={onExpandClick}>
              <Icon name='expand' />
              &nbsp;&nbsp;
              <span>{t('ui.expandPanel')}</span>
            </Button>
          )}
        </>
      )}
    >
      {_isEmpty(results) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('tradesTableModal.noTrades')}
          </span>
        </div>
      ) : (
        <VirtualTable
          ref={tableRef}
          deferredMeasurementCache={rowCache}
          rowHeight={rowCache.rowHeight}
          rowRenderer={rowRenderer}
          columns={columns}
          data={results || []}
          scrollingResetTimeInterval={0}
          defaultSortBy='entryAt'
          defaultSortDirection='DESC'
        />
      )}
    </Panel>
  )
}

StrategyTradesTable.propTypes = {
  results: PropTypes.object,  // eslint-disable-line
  layoutConfig: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  setLayoutConfig: PropTypes.func.isRequired,
  strategy: PropTypes.object.isRequired, // eslint-disable-line
  metrics: PropTypes.shape({
    nCandles: PropTypes.number,
    nTrades: PropTypes.number,
    nGains: PropTypes.number,
    nLosses: PropTypes.number,
    nStrategyTrades: PropTypes.number,
    nOpens: PropTypes.number,
    pl: PropTypes.number,
    pf: PropTypes.number,
    maxPL: PropTypes.number,
    minPL: PropTypes.number,
    fees: PropTypes.number,
    vol: PropTypes.number,
    stdDeviation: PropTypes.number,
    avgPL: PropTypes.number,
    backtestOptions: PropTypes.shape({
      activeMarket: PropTypes.string,
    }),
    allocation: PropTypes.string,
    positionSize: PropTypes.string,
    currentAllocation: PropTypes.string,
    availableFunds: PropTypes.string,
    equityCurve: PropTypes.string,
    return: PropTypes.string,
    returnPerc: PropTypes.string,
    drawdown: PropTypes.string,
  }),
}

StrategyTradesTable.defaultProps = {
  metrics: {
    nCandles: 0,
    nTrades: 0,
    nGains: 0,
    nLosses: 0,
    nStrategyTrades: 0,
    nOpens: 0,
    pl: 0,
    pf: 0,
    maxPL: 0,
    minPL: 0,
    fees: 0,
    vol: 0,
    stdDeviation: 0,
    avgPL: 0,
    backtestOptions: {
      activeMarket: null,
    },
  },
}

export default memo(StrategyTradesTable)
