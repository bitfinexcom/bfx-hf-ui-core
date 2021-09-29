import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import { VirtualTable } from '@ufx-ui/core'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { useTranslation } from 'react-i18next'

import BalancesTableColumns from './BalancesTable.columns'

const { getCurrencySymbolMemo } = reduxSelectors

// balance < 0.000000004 will be rounded and shown as 0.00000000, so hide at this threshold
const DUST_THRESHOLD = 0.000000004

const BalancesTable = ({
  renderedInTradingState, filteredBalances, balances, hideZeroBalances,
}) => {
  const { t } = useTranslation()
  const data = renderedInTradingState ? filteredBalances : balances
  const filtered = hideZeroBalances
    ? _filter(data, b => +b.balance > DUST_THRESHOLD)
    : data

  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)

  if (_isEmpty(filtered)) {
    return (
      <p className='empty'>{t('balancesTableModal.noBalances')}</p>
    )
  }

  return (
    <VirtualTable
      data={filtered}
      columns={BalancesTableColumns(getCurrencySymbol, t)}
      defaultSortBy='context'
      defaultSortDirection='ASC'
    />
  )
}

BalancesTable.propTypes = {
  balances: PropTypes.arrayOf(PropTypes.object),
  filteredBalances: PropTypes.arrayOf(PropTypes.object),
  renderedInTradingState: PropTypes.bool,
  hideZeroBalances: PropTypes.bool,
}

BalancesTable.defaultProps = {
  balances: [],
  filteredBalances: [],
  renderedInTradingState: false,
  hideZeroBalances: true,
}

export default memo(BalancesTable)
