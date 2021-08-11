import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.ZENDESK
const EMPTY_OBJ = {}

const getCcyArticles = (state) => _get(state, `${path}.articles`, EMPTY_OBJ)

console.log(getCcyArticles, 'getCcyArticles')

export default getCcyArticles
