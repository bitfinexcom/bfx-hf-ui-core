import React, { memo, useState } from 'react'
import { Button, VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import _findIndex from 'lodash/findIndex'

import { Icon } from 'react-fa'
import Panel from '../../ui/Panel'
import BacktestTradesTableColumns from './BacktestTradesTable.columns'
import {
  COMPONENTS_KEYS,
  LAYOUT_CONFIG,
} from '../StrategyEditor/components/StrategiesGridLayout.constants'

import { onTradeExportClick } from './BacktestTradesTable.helpers'
import { getActiveMarket } from '../../redux/selectors/ui'

import './style.css'

const BacktestTradesTable = ({
  results,
  onTradeClick,
  setLayoutConfig,
  layoutConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const activeMarket = useSelector(getActiveMarket)
  const strategyTrades = results.strategy?.trades
  const { trades = strategyTrades } = results

  const onExpandClick = () => {
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
  }

  const onCompressClick = () => {
    setIsExpanded(false)
    setLayoutConfig(LAYOUT_CONFIG)
  }

  const { t } = useTranslation()

  return (
    <Panel
      dark
      darkHeader
      label={t('tradesTableModal.title')}
      removeable={false}
      moveable={false}
      className='backtesttradestable__wrapper'
      hideIcons
      hasShadow={isExpanded}
      preHeaderComponents={(
        <>
          <Button
            className='panel-button'
            onClick={() => onTradeExportClick(trades, results, activeMarket, t)}
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
      {_isEmpty(trades) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('tradesTableModal.noTrades')}
          </span>
        </div>
      ) : (
        <VirtualTable
          data={trades}
          columns={BacktestTradesTableColumns(t)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={({ rowData }) => onTradeClick(rowData)}
        />
      )}
    </Panel>
  )
}

BacktestTradesTable.propTypes = {
  results: PropTypes.shape({
    strategy: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
    trades: PropTypes.arrayOf(PropTypes.object).isRequired,  // eslint-disable-line
  }).isRequired,
  onTradeClick: PropTypes.func.isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  setLayoutConfig: PropTypes.func.isRequired,
}

export default memo(BacktestTradesTable)
