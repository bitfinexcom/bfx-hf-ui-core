/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {
  useEffect,
  memo,
  useState,
  useRef,
  useCallback,
  useMemo,
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
import {
  STRATEGY_LAYOUT_CONFIG_SHAPE,
  STRATEGY_SHAPE,
  STRATEGY_TRADE_SHAPE,
} from '../../constants/prop-types-shapes'
import { getFormatTimeFn } from '../../redux/selectors/ui'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const StrategyTradesTable = ({
  results,
  setLayoutConfig,
  layoutConfig,
  strategy,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const formatTime = useSelector(getFormatTimeFn)

  const { strategyOptions: { symbol = {} } = {} } = strategy
  const { t } = useTranslation()

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

  const onExportButtonClick = useCallback(
    () => onTradeExportClick(results, symbol, t, getCurrencySymbol, formatTime),
    [getCurrencySymbol, results, symbol, t, formatTime],
  )

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const tableRef = useRef()
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.recomputeRowHeights()
    }
  }, [tableRef, selectedIndex, isExpanded])

  const columns = StrategyTradesTableColumns({
    t,
    selectedIndex,
    setSelectedIndex,
    formatTime,
  })

  const rowRenderer = useMemo(
    () => getRowRenderer(selectedIndex),
    [selectedIndex],
  )

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
            onClick={onExportButtonClick}
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
  results: PropTypes.shape(STRATEGY_TRADE_SHAPE).isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.shape(STRATEGY_LAYOUT_CONFIG_SHAPE))
    .isRequired,
  setLayoutConfig: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
}

export default memo(StrategyTradesTable)
