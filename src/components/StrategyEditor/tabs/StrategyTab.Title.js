import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import StrategiesMenuSideBarParams from '../components/StrategiesMenuSideBarParams'
import Indicator from '../../../ui/Indicator'

const titleWithIndicatorStyles = {
  marginRight: '10px',
}

const StrategyTabTitle = (props) => {
  const { executionResults, selectedTab } = props

  const [paramsOpen, setParamsOpen] = useState(false)

  const { results, executing, loading } = executionResults

  const { t } = useTranslation()
  const title = t('strategyEditor.strategyTab')

  const getTabTitle = () => {
    if (loading) {
      return (
        <>
          <span style={titleWithIndicatorStyles}>{title}</span>
          <Indicator white blinking />
        </>
      )
    }
    if (executing) {
      return (
        <>
          <span style={titleWithIndicatorStyles}>{title}</span>
          <Indicator red blinking={false} />
        </>
      )
    }
    if (!_isEmpty(results)) {
      return (
        <>
          <span style={titleWithIndicatorStyles}>{title}</span>
          <Indicator green />
        </>
      )
    }
    return <span>{title}</span>
  }

  const closeParams = () => setParamsOpen(false)

  useEffect(() => {
    if (selectedTab === 0) {
      setParamsOpen(true)
    }
  }, [selectedTab])

  return (
    <>
      {getTabTitle()}
      {paramsOpen && (
        <OutsideClickHandler onOutsideClick={closeParams}>
          <StrategiesMenuSideBarParams
            {...props}
            executing={executing}
            closeParams={closeParams}
          />
        </OutsideClickHandler>
      )}
    </>
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
}

export default StrategyTabTitle
