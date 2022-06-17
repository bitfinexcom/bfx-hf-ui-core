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
  [tableRef, selectedIndex])

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
            onClick={() => onTradeExportClick(results, results, symbol, t, getCurrencySymbol)}
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
}

export default memo(StrategyTradesTable)
