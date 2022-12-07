import React from 'react'
import { Icon } from 'react-fa'
import _map from 'lodash/map'
import _size from 'lodash/size'
import OutsideClickHandler from 'react-outside-click-handler'
import Button from '../../ui/Button'

import { defaultCellRenderer } from '../../util/ui'
import { Item } from '../Navbar/Navbar.LayoutSettings'
import { getAOContext } from '../../util/order'

const getOrderDetails = (rowData = {}) => {
  const { args = {}, id } = rowData

  switch (id) {
    case 'bfx-twap':
      return [
        { label: 'Interval', value: `${args.sliceInterval}s` },
        { label: 'Slice', value: args.sliceAmount },
        { label: 'Target', value: args.priceCondition },
      ]
    default:
      return []
  }
}

export default ({
  authToken,
  cancelOrder,
  gaCancelOrder,
  t,
  getMarketPair,
  editOrder,
  showActions,
  activeOrderGID,
  setActiveOrderGID,
  moreInfoGID,
  setMoreInfoGID,
}) => {
  const columns = [
    {
      label: t('table.alias'),
      dataKey: 'name',
      width: 90,
      flexGrow: 0.7,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.name),
    },
    {
      label: t('table.created'),
      dataKey: 'createdAt',
      width: 175,
      flexGrow: 1.75,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
        new Date(rowData.createdAt || +rowData.gid).toLocaleString(),
      ),
    },
    {
      label: t('table.lastActive'),
      dataKey: 'createdAt',
      width: 175,
      flexGrow: 1.75,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
        'N/A',
        // new Date(rowData.createdAt || +rowData.gid).toLocaleString(),
      ),
    },
    {
      label: t('table.symbol'),
      dataKey: 'args.symbol',
      width: 150,
      flexGrow: 1.5,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.args?.symbol)),
    },
  ]

  if (showActions) {
    // 'More info' button
    columns.push({
      label: '',
      dataKey: '',
      width: 250,
      flexGrow: 2.5,
      cellRenderer: ({ rowData = {} }) => {
        const orderDetails = getOrderDetails(rowData)
        const detailsSize = _size(orderDetails)

        return (
          <div>
            <div
              className='hfui-aolist__wrapper_more_info'
              onClick={() => setMoreInfoGID(rowData.gid)}
            >
              <Icon
                name='info-circle'
                aria-label='More info'
                onClick={() => { }}
              />
              <span className='more_info_action'>
                {t('table.moreInfo')}
              </span>
            </div>

            {console.log(rowData)}

            {moreInfoGID === rowData?.gid && (
              <OutsideClickHandler onOutsideClick={() => setMoreInfoGID(null)}>
                <div className='hfui-navbar__layout-settings__menu hfui-aolist__wrapper_order_info'>
                  <div className='title-container'>
                    <div className='hfui-navbar__layout-settings__title'>
                      {rowData?.name}
                      <span className='sub-title'>
                        {rowData?.label}
                      </span>
                    </div>
                    <Button
                      onClick={() => setMoreInfoGID(null)}
                      key='close-btn'
                      className='close-btn'
                      label={[
                        <p key='text'>&#10005;</p>,
                      ]}
                    />
                  </div>
                  <div className='basic-info'>
                    <div className='info-col'>
                      <span className='info-label'>
                        {t('table.created')}
                      </span>
                      {' '}
                      <span className='info-value'>
                        {new Date(rowData.createdAt || +rowData.gid).toLocaleString()}
                      </span>
                    </div>
                    <div className='info-col'>
                      <span className='info-label'>
                        {t('table.symbol')}
                      </span>
                      {' '}
                      <span className='info-value'>
                        {rowData?.args?.symbol}
                      </span>
                    </div>
                    <div className='info-col'>
                      <span className='info-label'>
                        {t('table.context')}
                      </span>
                      {' '}
                      <span className='info-value'>
                        {getAOContext(rowData)}
                      </span>
                    </div>
                  </div>
                  <p className='info-title'>
                    {t('table.orderDetails')}
                  </p>
                  <div className='basic-info'>
                    {_map(orderDetails, ({ label, value }, index) => (
                      <div className='info-col' key={label}>
                        <span className='info-label'>
                          {label}
                        </span>
                        =
                        <span className='info-value'>
                          {value}
                        </span>
                        {index !== detailsSize - 1 && ', '}
                      </div>
                    ))}
                  </div>
                  <div className='order-history'>
                    <p className='order-history_title'>
                      {t('table.atomicHistory')}
                    </p>
                    <div
                      className='order-history_button'
                      onClick={() => {}}
                    >
                      {t('table.exportJSON')}
                    </div>
                  </div>
                  {/* <div className='order-history-table'>

                  </div> */}
                </div>
              </OutsideClickHandler>
            )}
          </div>
        )
      },
    })

    // 'Actions' column
    columns.push({
      dataKey: 'cid',
      width: 20,
      minWidth: 20,
      cellRenderer: (
        { rowData = {} } // eslint-disable-line
      ) => (
        <div className='icons-cell'>
          <Icon
            className='more-options-button'
            name='ellipsis-v'
            aria-label='More options'
            onClick={() => rowData?.gid && setActiveOrderGID(rowData.gid)}
          />

          {activeOrderGID === rowData?.gid && (
            <OutsideClickHandler onOutsideClick={() => setActiveOrderGID(null)}>
              <div className='hfui-navbar__layout-settings__menu edit-order-menu'>
                <div className='hfui-navbar__layout-settings__menu-buttons' onClick={() => setActiveOrderGID(null)}>
                  <Item onClick={() => editOrder(rowData)}>
                    {t('table.edit')}
                  </Item>
                  <Item
                    onClick={() => {
                      cancelOrder(authToken, rowData)
                      gaCancelOrder()
                    }}
                  >
                    {t('table.cancelRemaining')}
                  </Item>
                </div>
              </div>
            </OutsideClickHandler>
          )}
        </div>
      ),
      disableSort: true,
    })
  }

  return columns
}
