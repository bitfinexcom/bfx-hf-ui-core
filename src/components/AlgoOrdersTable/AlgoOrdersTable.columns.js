import React from 'react'
import { Icon } from 'react-fa'
import OutsideClickHandler from 'react-outside-click-handler'
import Button from '../../ui/Button'

import { defaultCellRenderer } from '../../util/ui'
import { Item } from '../Navbar/Navbar.LayoutSettings'
import { getAOContext } from '../../util/order'

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
      cellRenderer: ({ rowData = {} }) => (
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
              </div>
            </OutsideClickHandler>
          )}
        </div>
      ),
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
