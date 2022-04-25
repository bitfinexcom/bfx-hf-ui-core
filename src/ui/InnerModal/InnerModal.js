/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'
import Scrollbars from '../Scrollbars'
import useModalFocus from '../../hooks/useModalFocus'

import './style.css'

const InnerModal = ({
  children, title, onClose, scrollable, className,
}) => {
  const containerRef = useRef(null)

  const handleOuterClick = () => onClose()

  const handleInnerClick = (e) => {
    if (e.target.nodeName === 'BUTTON') {
      return
    }
    e.stopPropagation()
  }

  useModalFocus()

  useEffect(() => {
    containerRef.current.addEventListener('click', handleInnerClick)
    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cx('hfui-inner-modal', className)} ref={containerRef}>
      <div className='modal__title' tabIndex='0'>{title}</div>
      <button type='button' className='modal__close-button' onClick={onClose}>✕</button>
      <div className='modal__body'>
        {scrollable ? (
          <Scrollbars>
            {children}
          </Scrollbars>
        ) : children}

      </div>
    </div>
  )
}

InnerModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  scrollable: PropTypes.bool,
  className: PropTypes.string,
}

InnerModal.defaultProps = {
  scrollable: false,
  className: null,
}

export default memo(InnerModal)
