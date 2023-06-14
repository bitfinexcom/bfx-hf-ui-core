import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.AOS

const getIsActiveAlgoOrdersAfterLogin = (state) => _get(state, `${path}.isAlgoOrdersAfterLogin`, true)

export default getIsActiveAlgoOrdersAfterLogin
