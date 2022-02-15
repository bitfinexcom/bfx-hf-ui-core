import React, { memo } from 'react'
import { VirtualTable } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Panel from '../../ui/Panel'
import Button from '../../ui/Button'
import StrategyTradesTableColumns from './StrategyTradesTable.columns'
import './style.css'

const StrategyTradesTable = ({
  label, trades, onTradeClick, onTradeExportClick, dark,
}) => {
  const { t } = useTranslation()

  return (
    <Panel
      dark={dark}
      darkHeader={dark}
      label={(
        <>
          {label}
          <Button
            className='export_csv_btn'
            onClick={onTradeExportClick}
            label={[
              <Icon key='icon' name='upload' />,
              <p key='text'>{t('ui.export')}</p>,
            ]}
          />
        </>
      )}
      removeable={false}
      moveable={false}
      className='hfui-strategytradestable__wrapper'
    >
      {_isEmpty(trades)
        ? (
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
  trades: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTradeClick: PropTypes.func.isRequired,
  onTradeExportClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  dark: PropTypes.bool,
}

StrategyTradesTable.defaultProps = {
  label: 'Strategy Trades',
  dark: true,
}

export default memo(StrategyTradesTable)
