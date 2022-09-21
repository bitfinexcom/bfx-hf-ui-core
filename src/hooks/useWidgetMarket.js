import { useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'

import { getCurrentMode } from '../redux/selectors/ui'
import { PAPER_MODE } from '../redux/reducers/ui'
import routes from '../constants/routes'

function useWidgetMarket(savedMarket, activeMarket) {
  const isTradingTerminal = window.location.pathname === routes.tradingTerminal.path
  const currentMode = useSelector(getCurrentMode)

  if (isTradingTerminal || _isEmpty(savedMarket) || currentMode === PAPER_MODE) {
    return activeMarket
  }

  return savedMarket
}

export default useWidgetMarket
