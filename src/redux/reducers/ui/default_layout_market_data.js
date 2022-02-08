import { generateLayout } from '../../../components/GridLayout/Grid.layouts'
import marketDataLayout from '../../../components/GridLayout/layouts/marketData'
import { marketData } from '../../../constants/routes'

export default {
  routePath: marketData.path,
  canDelete: false,
  isDefault: true,
  savedAt: 0,
  layout: generateLayout(marketDataLayout)?.lg,
}
