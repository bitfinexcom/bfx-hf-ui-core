import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import { useSelector } from 'react-redux'
import Indicator from '../../../../ui/Indicator'
import useHover from '../../../../hooks/useHover'
import SidebarParams from '../../components/SidebarParams/SidebarParams'
import { getCurrentStrategyExecutionState } from '../../../../redux/selectors/ws'
import { getIsPaperTrading } from '../../../../redux/selectors/ui'

const StrategyTabTitle = (props) => {
  const {
    selectedTab, sidebarOpened, hasErrors, strategyDirty,
  } = props

  const executionState = useSelector(getCurrentStrategyExecutionState)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const { results, executing, loading } = executionState

  const [paramsOpen, setParamsOpen] = useState(false)
  const [hoverRef, isHovered] = useHover()

  const { t } = useTranslation()
  const title = t('strategyEditor.strategyTab')

  const isStrategyTabSelected = selectedTab === 0

  const indicatorClassName = !sidebarOpened ? 'indicator-near-icon' : null

  const getIndicator = () => {
    if (isPaperTrading && hasErrors) {
      return <Indicator red className={indicatorClassName} />
    }
    if (isPaperTrading && strategyDirty) {
      return <Indicator white className={indicatorClassName} />
    }
    if (loading) {
      return <Indicator white blinking className={indicatorClassName} />
    }
    if (executing) {
      return (
        <Indicator
          red
          blinking={!isStrategyTabSelected}
          className={indicatorClassName}
        />
      )
    }
    if (!_isEmpty(results)) {
      return <Indicator green className={indicatorClassName} />
    }
    return null
  }

  const closeParams = () => setParamsOpen(false)
  const openParams = () => setParamsOpen(true)

  useEffect(() => {
    if (isStrategyTabSelected && isHovered && !paramsOpen) {
      openParams()
    }
  }, [isHovered, paramsOpen, isStrategyTabSelected])

  return (
    <div
      className='hfui-strategyeditor__sidebar-title'
      onClick={openParams}
      ref={hoverRef}
    >
      <Icon name='file-code-o' className='title-icon' />
      {sidebarOpened && <span className='title-label'>{title}</span>}
      {getIndicator()}
      {paramsOpen && (
        <SidebarParams
          {...props}
          executing={executing}
          closeParams={closeParams}
          isTabHovered={isHovered}
        />
      )}
    </div>
  )
}

StrategyTabTitle.propTypes = {
  selectedTab: PropTypes.number.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
}

export default StrategyTabTitle
