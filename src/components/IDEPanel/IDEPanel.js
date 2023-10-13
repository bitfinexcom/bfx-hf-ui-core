import React, {
  useState, useMemo, useEffect,
} from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'clsx'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'
import _debounce from 'lodash/debounce'

import { useSelector } from 'react-redux'
import CodeMirror from '../StrategyEditor/components/CodeMirror'
import { getIsPaperTrading, getThemeSetting } from '../../redux/selectors/ui'
import Panel from '../../ui/Panel'
import { STRATEGY_IDE_SECTIONS } from '../StrategyEditor/StrategyEditor.helpers'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'
import { PAPER_MODE } from '../../redux/reducers/ui'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'

const IDEPanel = ({
  setStrategyDirty,
  onDefineIndicatorsChange,
  evalSectionContent,
  setSectionErrors,
  sectionErrors,
  setStrategy,
  strategy,
}) => {
  const [IDEcontent, setIDEcontent] = useState({})
  const [activeContent, setActiveContent] = useState('defineIndicators')
  const [execError, setExecError] = useState('')

  const settingsTheme = useSelector(getThemeSetting)
  const isPaperTrading = useSelector(getIsPaperTrading)

  const processStrategy = (updatedStrategy) => {
    const updatedContent = {}

    for (let i = 0; i < STRATEGY_IDE_SECTIONS.length; ++i) {
      const section = STRATEGY_IDE_SECTIONS[i]
      const content = updatedStrategy[section]

      if (!_isEmpty(content)) {
        updatedContent[section] = content
      }
    }

    return updatedContent
  }

  const setStrategyMemo = useMemo(
    () => _debounce(
      (content) => setStrategy({ ...strategy, strategyContent: content }, PAPER_MODE),
      500,
    ),
    [setStrategy, strategy],
  )

  const updateStrategy = (updatedStrategy) => {
    const content = processStrategy(updatedStrategy)
    setStrategyMemo(content)
    setIDEcontent(content)
  }

  const onEditorContentChange = (code) => {
    setStrategyDirty(true)
    updateStrategy({
      ...IDEcontent,
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

  useEffect(() => {
    if (strategy?.strategyContent) {
      const content = _get(strategy, 'strategyContent', {})
      setIDEcontent(content)
    }
    setActiveContent('defineIndicators')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy.id])

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
          {STRATEGY_IDE_SECTIONS.map((section) => (
            <li
              key={section}
              onClick={() => setActiveContent(section)}
              className={ClassNames({
                active: activeContent === section,
                hasError: !!sectionErrors[section],
              })}
            >
              <p>{section}</p>

              {_isEmpty(IDEcontent[section]) ? null : _isEmpty(
                sectionErrors[section],
              ) ? (
                <p>~</p>
                ) : (
                  <p>*</p>
                )}
            </li>
          ))}
        </ul>
        <div
          className='hfui-strategyeditor__editor-wrapper'
        >
          <CodeMirror
            value={IDEcontent[activeContent] || ''}
            activeContent={activeContent}
            onChange={onEditorContentChange}
            theme={settingsTheme}
            editable={isPaperTrading}
          />
          {(execError || sectionErrors[activeContent]) && (
            <div className='hfui-strategyeditor__editor-error-output'>
              <pre>{execError || sectionErrors[activeContent]}</pre>
              <PanelIconButton
                onClick={onClearErrors}
                icon={<i className='icon-cancel' />}
              />
            </div>
          )}
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
  strategy: PropTypes.shape(STRATEGY_SHAPE),
  setStrategy: PropTypes.func.isRequired,
}

IDEPanel.defaultProps = {
  sectionErrors: {},
  strategy: {
    id: null,
    label: null,
  },
}

export default IDEPanel
