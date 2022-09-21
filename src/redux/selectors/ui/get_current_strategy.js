import _get from 'lodash/get'

const { createSelector } = require('reselect')

const { getIsPaperTrading, getUIState } = require('.')
const { UI_KEYS } = require('../../constants/ui_keys')

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
