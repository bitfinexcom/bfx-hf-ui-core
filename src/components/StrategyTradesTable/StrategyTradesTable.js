/* eslint-disable react/prop-types */
import React, {
  useEffect, memo, useState, useRef, useCallback,
} from 'react'
import { Button, VirtualTable } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import _findIndex from 'lodash/findIndex'

import { Icon } from 'react-fa'

import Panel from '../../ui/Panel'
import StrategyTradesTableColumns, { getRowRenderer } from './StrategyTradesTable.columns'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from '../StrategyEditor/components/StrategiesGridLayout.constants'

import { onTradeExportClick } from './StrategyTradesTable.helpers'
import { getActiveMarket } from '../../redux/selectors/ui'
import WSActions from '../../redux/actions/ws'

import './style.css'

import TEST_DATA from './test_data'

const StrategyTradesTable = ({
  results,
  onTradeClick,
  setLayoutConfig,
  layoutConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const activeMarket = useSelector(getActiveMarket)

  // TODO: remove
  const dispatch = useDispatch()
  useEffect(() => {
    setTimeout(() => {
      console.log('useEffect setTimeout: ')
      dispatch(WSActions.setLiveExecutionTrades('6e76ab74-d26b-4115-bf66-aae2cff7e20e', TEST_DATA[0]))
    }, 500)
  }, [dispatch])

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
  [selectedIndex])

  // TODO: use dynamic height for selected row
  const _getRowHeight = ({ index }) => (index === selectedIndex ? 140 : 32)
  const columns = StrategyTradesTableColumns(t, selectedIndex, setSelectedIndex)

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
            onClick={() => onTradeExportClick(results, results, activeMarket, t)}
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
      {/* TODO: */}
      {/* {_isEmpty(results) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('tradesTableModal.noTrades')}
          </span>
        </div>
      ) : ( */}
      <VirtualTable
        ref={tableRef}
        data={results}
        columns={columns}
        defaultSortBy='mts'
        defaultSortDirection='DESC'
        onRowClick={({ rowData }) => onTradeClick(rowData)}
        rowRenderer={getRowRenderer(selectedIndex)}
        rowHeight={_getRowHeight}
      />
      {/* )} */}
    </Panel>
  )
}

StrategyTradesTable.propTypes = {
  results: PropTypes.shape({
    trades: PropTypes.arrayOf(PropTypes.object).isRequired,  // eslint-disable-line
  }).isRequired,
  onTradeClick: PropTypes.func.isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  setLayoutConfig: PropTypes.func.isRequired,
}

export default memo(StrategyTradesTable)
