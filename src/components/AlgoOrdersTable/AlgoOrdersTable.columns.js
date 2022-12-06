import React from 'react'
import { Icon } from 'react-fa'
import OutsideClickHandler from 'react-outside-click-handler'

import { defaultCellRenderer } from '../../util/ui'
import { Item } from '../Navbar/Navbar.LayoutSettings'

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
      cellRenderer: () => (
        <div className='hfui-aolist__wrapper_more_info'>
          <Icon
            name='info-circle'
            aria-label='More info'
            onClick={() => { }}
          />
          <span className='more_info_action'>
            {t('table.moreInfo')}
          </span>
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
              <div className='hfui-navbar__layout-settings__menu'>
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
