/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { renderLayoutElement } from './GridLayout.helpers'
import { getComponentState } from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'

const GridLayoutItem = ({
  def,
  layoutID,
  componentProps,
  onRemoveComponent,
}) => {
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

  return renderLayoutElement({
    layoutID,
    def,
    componentProps,
    onRemoveComponent,
    savedState,
    updateState,
  })
}

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
