import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getIsAOsHistoryLoaded = (state) => _get(state, `${path}.algoOrdersHistory.isLoaded`, false)

export default getIsAOsHistoryLoaded
