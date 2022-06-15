import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'clsx'
import _isEmpty from 'lodash/isEmpty'

import { useSelector } from 'react-redux'
import MonacoEditor from '../StrategyEditor/components/MonacoEditor'
import { getIsPaperTrading, getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'

const STRATEGY_SECTIONS = [
  'defineIndicators',
  'onPriceUpdate',
  'onEnter',
  'onUpdate',
  'onUpdateLong',
  'onUpdateShort',
  'onUpdateClosing',
  'onPositionOpen',
  'onPositionUpdate',
  'onPositionClose',
  'onStart',
  'onStop',
]

const IDEPanel = ({
  setStrategyDirty,
  onDefineIndicatorsChange,
  evalSectionContent,
  setSectionErrors,
  sectionErrors,
  IDEcontent: strategyContent,
  setIDEcontent,
}) => {
  const [activeContent, setActiveContent] = useState('defineIndicators')
  const [execError, setExecError] = useState('')

  const settingsTheme = useSelector(getThemeSetting)
  const isPaperTrading = useSelector(getIsPaperTrading)

  const processStrategy = (updatedStrategy) => {
    const updatedContent = {}

    for (let i = 0; i < STRATEGY_SECTIONS.length; ++i) {
      const section = STRATEGY_SECTIONS[i]
      const content = updatedStrategy[section]

      if (!_isEmpty(content)) {
        updatedContent[section] = content
      }
    }

    return updatedContent
  }

  const updateStrategy = (updatedStrategy) => {
    const content = processStrategy(updatedStrategy)
    setIDEcontent(content)
  }

  const onEditorContentChange = (code) => {
    setStrategyDirty(true)
    updateStrategy({
      ...strategyContent,
      [activeContent]: code,
    })

    if (activeContent === 'defineIndicators') {
      onDefineIndicatorsChange(code) // tracks errors
    } else {
      evalSectionContent(activeContent, code)
    }
  }

  const onClearErrors = () => {
    setSectionErrors({})
    setExecError('')
  }

  return (
    <Panel
      dark
      darkHeader
      moveable={false}
      removeable={false}
      hideIcons
      className='hfui-strategyeditor__ide'
    >
      <div className='hfui-strategyeditor__wrapper'>
        <ul className='hfui-strategyeditor__func-select'>
          {/* eslint-disable-next-line lodash/prefer-lodash-method */}
          {STRATEGY_SECTIONS.map((section) => (
            <li
              key={section}
              onClick={() => setActiveContent(section)}
              className={ClassNames({
                active: activeContent === section,
                hasError: !!sectionErrors[section],
              })}
            >
              <p>{section}</p>

              {_isEmpty(strategyContent[section]) ? null : _isEmpty(
                sectionErrors[section],
              ) ? (
                <p>~</p>
                ) : (
                  <p>*</p>
                )}
            </li>
          ))}
        </ul>

        <div className='hfui-strategyeditor__content-wrapper'>
          <div
            className={ClassNames('hfui-strategyeditor__editor-wrapper', {
              'exec-error': execError || sectionErrors[activeContent],
            })}
          >
            <MonacoEditor
              value={strategyContent[activeContent] || ''}
              onChange={onEditorContentChange}
              theme={settingsTheme}
              readOnly={!isPaperTrading}
            />
            {(execError || sectionErrors[activeContent]) && (
            <div className='hfui-strategyeditor__editor-error-output'>
              <p
                className='hfui-panel__close strategyeditor__close-icon'
                onClick={onClearErrors}
              >
                &#10005;
              </p>
              <pre>{execError || sectionErrors[activeContent]}</pre>
            </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  )
}

IDEPanel.propTypes = {
  setStrategyDirty: PropTypes.func.isRequired,
  onDefineIndicatorsChange: PropTypes.func.isRequired,
  evalSectionContent: PropTypes.func.isRequired,
  setSectionErrors: PropTypes.func.isRequired,
  sectionErrors: PropTypes.objectOf(PropTypes.string),
  setIDEcontent: PropTypes.func.isRequired,
  IDEcontent: PropTypes.objectOf(PropTypes.string).isRequired,
}

IDEPanel.defaultProps = {
  sectionErrors: {},
}

export default IDEPanel
