import React, { memo } from 'react'
import { Button, VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Icon } from 'react-fa'
import Panel from '../../ui/Panel'
import StrategyTradesTableColumns from './StrategyTradesTable.columns'

import { onTradeExportClick } from './StrategyTradesTable.helpers'
import { getActiveMarket } from '../../redux/selectors/ui'
// import Button from '../../ui/Button'

import './style.css'

const StrategyTradesTable = ({ results, onTradeClick, dark }) => {
  const { t } = useTranslation()

  const activeMarket = useSelector(getActiveMarket)
  const { trades } = results

  return (
    <Panel
      dark={dark}
      darkHeader={dark}
      label={t('tradesTableModal.title')}
      removeable={false}
      moveable={false}
      className='hfui-strategytradestable__wrapper'
      hideIcons
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
          <Button
            className='panel-button'
            onClick={() => {}}
          >
            <Icon name='compress' />
            &nbsp;&nbsp;
            <span>EXPAND PANEL</span>
          </Button>
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
          columns={StrategyTradesTableColumns(t)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={({ rowData }) => onTradeClick(rowData)}
        />
      )}
    </Panel>
  )
}

StrategyTradesTable.propTypes = {
  results: PropTypes.shape({
    trades: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  }).isRequired,
  onTradeClick: PropTypes.func.isRequired,
  dark: PropTypes.bool,
}

StrategyTradesTable.defaultProps = {
  dark: true,
}

export default memo(StrategyTradesTable)
