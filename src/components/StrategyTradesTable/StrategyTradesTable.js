/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {
  useEffect, memo, useState, useRef, useCallback, useMemo,
} from 'react'
import {
  Button, VirtualTable,
} from '@ufx-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import _findIndex from 'lodash/findIndex'
import { Icon } from 'react-fa'

import Panel from '../../ui/Panel'
import StrategyTradesTableColumns from './StrategyTradesTable.columns'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from '../StrategyEditor/components/StrategiesGridLayout.constants'
import { getRowRenderer, rowCache } from './StrategyTradesTable.Row'

import { onTradeExportClick } from './StrategyTradesTable.helpers'
import { getActiveMarket } from '../../redux/selectors/ui'

import './style.css'

import TEST_DATA from './test_data'

const StrategyTradesTable = ({
  // results,
  setLayoutConfig,
  layoutConfig,
}) => {
  const results = TEST_DATA
  const [isExpanded, setIsExpanded] = useState(false)
  const activeMarket = useSelector(getActiveMarket)

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

  // const rowRenderer = (props) => {
  //   const {
  //     parent, index, key, rowData, columns: rowCols,
  //   } = props

  //   return (
  //     <CellMeasurer
  //       cache={_cache}
  //       key={key}
  //       parent={parent}
  //       columnIndex={0}
  //       rowIndex={index}
  //     >
  //       {({ measure, registerChild }) => (
  //         <MAIN_ROW
  //           rowIndex={index}
  //           selectedIndex={selectedIndex}
  //           columns={rowCols}
  //           measure={measure}
  //           registerChild={registerChild}
  //           rowData={rowData}
  //         />
  //       )}
  //     </CellMeasurer>
  //   )
  // }

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
      <VirtualTable
        ref={tableRef}
        deferredMeasurementCache={rowCache}
        rowHeight={rowCache.rowHeight}
        rowRenderer={rowRenderer}
        columns={columns}
        data={results || []}
      />
    </Panel>
  )
}

StrategyTradesTable.propTypes = {
  results: PropTypes.shape({
    trades: PropTypes.arrayOf(PropTypes.object).isRequired,  // eslint-disable-line
  }).isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  setLayoutConfig: PropTypes.func.isRequired,
}

export default memo(StrategyTradesTable)
