import { useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'

import { getCurrentMode } from '../redux/selectors/ui'
import { PAPER_MODE } from '../redux/reducers/ui'

function useWidgetMarket(savedMarket, activeMarket) {
  const currentMode = useSelector(getCurrentMode)

  if (_isEmpty(savedMarket) || currentMode === PAPER_MODE) {
    return activeMarket
  }

  return savedMarket
}

export default useWidgetMarket
