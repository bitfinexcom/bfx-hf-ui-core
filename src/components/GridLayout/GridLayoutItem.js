/* eslint-disable react/forbid-prop-types */
import React, { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { renderLayoutElement } from './GridLayout.helpers'
import { getComponentState } from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'

const GridLayoutItem = forwardRef(
  ({
    def,
    layoutID,
    componentProps,
    onRemoveComponent,
    ...props
  }, ref) => {
    const dispatch = useDispatch()

    const componentID = def.i

    const savedState = useSelector((state) => getComponentState(state, layoutID, def.c, componentID),
    )
    const updateState = useCallback(
      (state) => {
        dispatch(
          UIActions.updateComponentState({
            state,
            layoutID,
            componentID,
          }),
        )
      },
      [componentID, dispatch, layoutID],
    )

    return (
      <div {...props} ref={ref}>
        {renderLayoutElement({
          layoutID,
          def,
          componentProps,
          onRemoveComponent,
          savedState,
          updateState,
        })}
      </div>
    )
  },
)

GridLayoutItem.displayName = GridLayoutItem

GridLayoutItem.propTypes = {
  def: PropTypes.object.isRequired,
  layoutID: PropTypes.string,
  componentProps: PropTypes.object.isRequired,
  onRemoveComponent: PropTypes.func.isRequired,
}

GridLayoutItem.defaultProps = {
  layoutID: '',
}

export default GridLayoutItem
