import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { getIsPaperTrading, getUIState } from '.'
import { UI_KEYS } from '../../constants/ui_keys'

const strategyEditorState = (state) => getUIState(state, UI_KEYS.strategyEditor, {})

const getCurrentStrategy = createSelector(
  [getIsPaperTrading, strategyEditorState],
  (isPaperTrading, strategyEditor) => _get(
    strategyEditor,
    isPaperTrading ? 'strategySandboxMode' : 'strategyMainMode',
    {},
  ),
)

export default getCurrentStrategy
