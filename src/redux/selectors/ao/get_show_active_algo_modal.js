import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.AOS

export default (state) => _get(state, `${path}.showActiveAlgoModal`, false)
