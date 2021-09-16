import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.AOS

const EMPTY_ARR = []

export default (state) => {
  return _get(state, `${path}.aoParams`, EMPTY_ARR)
}
