import { defaultCellRenderer } from '../../../util/ui'

const STYLES = {
  RIGHT_ALIGN: { textAlign: 'right' },
}

export default (t) => ([
  {
    label: t('table.id'),
    dataKey: 'order_id',
    cellRenderer: ({ rowData }) => defaultCellRenderer(`#${rowData?.order_id}`),
  },
  {
    label: t('table.action'),
    dataKey: 'amount',
    cellRenderer: ({ rowData }) => (rowData?.amount < 0 ? 'SELL' : 'BUY'),
  },
  {
    label: t('table.type'),
    dataKey: 'type',
    cellRenderer: ({ rowData }) => defaultCellRenderer(rowData?.order_js?.type),
  },
  {
    label: t('table.timestamp'),
    dataKey: 'mtsCreate',
    cellRenderer: ({ rowData }) => defaultCellRenderer(new Date(rowData?.order_js?.mtsCreate).toLocaleString()),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.executedAt'),
    dataKey: 'mtsUpdate',
    cellRenderer: ({ rowData }) => defaultCellRenderer(new Date(rowData?.order_js?.mtsUpdate).toLocaleString()),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.orderPrice'),
    dataKey: 'price',
    cellRenderer: ({ rowData }) => defaultCellRenderer(rowData?.order_js?.price),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.tradePrice'),
    dataKey: 'priceAvg',
    cellRenderer: ({ rowData }) => defaultCellRenderer(rowData?.order_js?.priceAvg),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.units'),
    dataKey: 'amount',
    cellRenderer: ({ rowData }) => defaultCellRenderer(rowData?.amount),
    style: STYLES.RIGHT_ALIGN,
  },
])
