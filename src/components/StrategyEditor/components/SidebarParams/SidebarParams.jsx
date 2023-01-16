import React, { memo, useEffect, useRef } from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import useHover from '../../../../hooks/useHover'
import { getIsPaperTrading } from '../../../../redux/selectors/ui'
import ParamsForSandbox from './ParamsForSandbox'
import ParamsForLive from './ParamsForLive'

const StrategyParams = ({
  onLoadStrategy,
  executing,
  closeParams,
  isTabHovered,
  sidebarOpened,
  isMarketSelected,
  ...props
}) => {
  const [hoverRef, isHovered] = useHover()

  const timeoutRef = useRef()

  const onClose = () => {
    onLoadStrategy({})
  }

  const isPaperTrading = useSelector(getIsPaperTrading)

  useEffect(() => {
    // We need to use timeout for closing bar because isHovered becomes false,
    // when user move mouse between menu items and subsequently, bar blinks
    if (!isHovered && !isTabHovered) {
      timeoutRef.current = setTimeout(() => closeParams(), 200)
      return
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isHovered, closeParams, isTabHovered])

  return (
    <div className='hfui-orderform__ao-settings'>
      <div
        className={cx(
          'hfui-orderform__ao-settings__menu hfui-strategy__options-panel',
          {
            'hfui-strategy__options-panel--sidebar-closed': !sidebarOpened,
          },
        )}
        ref={hoverRef}
        onClick={closeParams}
      >
        {isPaperTrading ? (
          <ParamsForSandbox
            onClose={onClose}
            isExecutionDisabled={!isMarketSelected}
            {...props}
          />
        ) : (
          <ParamsForLive
            onClose={onClose}
            executing={executing}
            {...props}
          />
        )}
      </div>
    </div>
  )
}

StrategyParams.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
  executing: PropTypes.bool.isRequired,
  isTabHovered: PropTypes.bool.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
  closeParams: PropTypes.func.isRequired,
  isMarketSelected: PropTypes.bool.isRequired,
}

export default memo(StrategyParams)
