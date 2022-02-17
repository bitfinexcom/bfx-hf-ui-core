/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue, Tooltip } from '@ufx-ui/core'
import { Icon } from 'react-fa'

import { defaultCellRenderer } from '../../util/ui'
import { orderContext } from '../../util/order'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../constants/precision'
import VisibleOnHitIcon from '../../ui/Icons/VisibleOnHitIcon'

const STYLES = {
  amount: { justifyContent: 'flex-end' },
  price: { justifyContent: 'flex-end' },
  status: { display: 'flex', flexDirection: 'row' },
  statusText: { width: '50px' },
  statusIcon: { width: '10px' },
}

export default (authToken, cancelOrder, { width }, t, getMarketPair, editOrder, getIsDerivativePair, orders) => [{
  label: '',
  dataKey: '',
  width: 15,
  flexGrow: 0.15,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className={`row-marker ${rowData.amount < 0 ? 'red' : 'green'} ${width < 700 ? 'stick' : ''} ${width < 450 ? 'stick2' : ''}`} />
  ),
  disableSort: true,
}, {
  label: t('table.pair'),
  dataKey: 'symbol',
  width: 135,
  flexGrow: 1.35,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.symbol)),
}, {
  label: t('table.type'),
  dataKey: 'type',
  width: 120,
  flexGrow: 1.2,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(orderContext(rowData, getIsDerivativePair, t, orders)),
}, {
  label: t('table.created'),
  dataKey: 'created',
  width: 135,
  flexGrow: 1.35,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(+rowData.created).toLocaleString()),
}, {
  label: t('table.amount'),
  dataKey: 'amount',
  width: 110,
  flexGrow: 1.1,
  headerStyle: STYLES.amount,
  style: STYLES.amount,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
    <PrettyValue
      value={rowData?.amount}
      decimals={AMOUNT_DECIMALS}
      fadeTrailingZeros
      strike={0}
    />,
  ),
}, {
  label: t('table.price'),
  dataKey: 'price',
  width: 100,
  flexGrow: 1,
  headerStyle: STYLES.price,
  style: STYLES.price,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
    <PrettyValue
      value={rowData?.price}
      sigFig={PRICE_SIG_FIGS}
      fadeTrailingZeros
    />,
  ),
}, {
  label: t('table.status'),
  dataKey: 'status',
  width: 120,
  flexGrow: 1.2,
  cellRenderer: ({ rowData = {} }) => (
    <div style={STYLES.status} className='order-status'>
      <div style={STYLES.statusText}>
        {defaultCellRenderer(t(`orderStatuses.${rowData.status}`))}
      </div>
      <div style={STYLES.statusIcon}>
        {rowData.hidden && !rowData.visibleOnHit && (
          <Tooltip content={t('orderForm.hidden')}>
            <Icon name='eye-slash' />
          </Tooltip>
        )}
        {rowData.hidden && rowData.visibleOnHit && (
          <Tooltip content={t('orderForm.visibleOnHit')}>
            <VisibleOnHitIcon />
          </Tooltip>
        )}
        {rowData.tif && (
          <Tooltip content={rowData.tifDate.toLocaleString()}>
            <Icon name='clock-o' />
          </Tooltip>
        )}
        {rowData.postonly && (
          <Tooltip content={t('orderForm.postOnlyCheckbox')}>
            <Icon name='info' />
          </Tooltip>
        )}
        {rowData.reduceonly && (
          <Tooltip content={t('orderForm.reduceOnlyCheckbox')}>
            <Icon name='info-circle' />
          </Tooltip>
        )}
      </div>
    </div>
  ),
}, {
  dataKey: 'cid',
  width: 50,
  minWidth: 50,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className='icons-cell'>
      <Icon
        name='pencil'
        aria-label='Edit order'
        onClick={() => editOrder(rowData)}
      />
      <i
        role='button'
        aria-label='Cancel order'
        tabIndex={0}
        className='icon-cancel'
        onClick={() => cancelOrder(authToken, rowData)}
      />
    </div>
  ),
  disableSort: true,
}]
