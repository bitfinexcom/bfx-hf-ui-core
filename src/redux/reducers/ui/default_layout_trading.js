import { tradingTerminal } from '../../../constants/routes'
import { generateLayout } from '../../../components/GridLayout/Grid.layouts'
import tradingTerminalLayout from '../../../components/GridLayout/layouts/trading'

export default {
  routePath: tradingTerminal.path,
  canDelete: false,
  isDefault: true,
  savedAt: 0,
  layout: generateLayout(tradingTerminalLayout)?.lg,
}
