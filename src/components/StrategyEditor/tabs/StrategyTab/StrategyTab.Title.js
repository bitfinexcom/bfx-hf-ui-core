import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import StrategiesMenuSideBarParams from '../../components/StrategiesMenuSideBarParams'
import Indicator from '../../../../ui/Indicator'
import useHover from '../../../../hooks/useHover'

const StrategyTabTitle = (props) => {
  const { executionResults, selectedTab, sidebarOpened } = props
  const { results, executing, loading } = executionResults

  const [paramsOpen, setParamsOpen] = useState(false)
  const [hoverRef, isHovered] = useHover()

  const { t } = useTranslation()
  const title = t('strategyEditor.strategyTab')

  const isStrategyTabSelected = selectedTab === 0

  const indicatorClassName = !sidebarOpened ? 'indicator-near-icon' : null

  const getIndicator = () => {
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
        <StrategiesMenuSideBarParams
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
  executionResults: PropTypes.shape({
    executing: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    results: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
  selectedTab: PropTypes.number.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
}

export default StrategyTabTitle
