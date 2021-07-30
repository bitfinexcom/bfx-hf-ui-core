import _capitalize from 'lodash/capitalize'
import { prepareAmount } from 'bfx-api-node-util'
import { processBalance } from '../../util/ui'

const STYLES = {
  total: { justifyContent: 'flex-end' },
  available: { justifyContent: 'flex-end' },
}

export default () => [{
  label: 'Context',
  dataKey: 'context',
  width: 120,
  flexGrow: 1,
  cellRenderer: ({ rowData = {} }) => _capitalize(rowData.context),
}, {
  label: 'Currency',
  dataKey: 'currency',
  width: 100,
  flexGrow: 1,
  cellRenderer: ({ rowData = {} }) => rowData.currency,
}, {
  label: 'Total',
  dataKey: 'balance',
  width: 120,
  flexGrow: 1,
  headerStyle: STYLES.total,
  style: STYLES.total,
  cellRenderer: ({ rowData = {} }) => processBalance(prepareAmount(rowData.balance)),
}, {
  label: 'Available',
  dataKey: 'available',
  width: 120,
  flexGrow: 1,
  headerStyle: STYLES.available,
  style: STYLES.available,
  cellRenderer: ({ rowData = {} }) => processBalance(prepareAmount(rowData.available)),
}]
