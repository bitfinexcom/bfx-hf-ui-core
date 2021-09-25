import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.NOTIFICATIONS
const EMPTY_ARR = []

export default (state) => _get(state, path, EMPTY_ARR)
