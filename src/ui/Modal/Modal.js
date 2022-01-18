import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Dialog } from '@ufx-ui/core'
import Scrollbars from '../Scrollbars'

import './style.css'

const FOCUSABLE_ELEMENTS = ['input', 'button', '[role=button]']

const Modal = ({
  label, isOpen, onClose, onSubmit, children, className, scrollable, ...rest
}) => {
  useEffect(() => {
    // focus on the first interactable element
    if (isOpen) {
      // eslint-disable-next-line lodash/prefer-lodash-method
      const el = document.querySelector(FOCUSABLE_ELEMENTS.map(element => `.modal__body ${element}`).join(','))
      const footer = document.querySelector('.modal__footer')
      if (el && footer && !footer.contains(el)) {
        el.focus()
      } else {
        const titleNode = document.querySelector('.modal__title')
        if (titleNode && titleNode.focus) {
          titleNode.focus()
        }
      }
    }
  }, [isOpen])

  return (
    <Dialog
      isOpen={isOpen}
      title={label}
      onClose={onClose}
      onSubmit={onSubmit}
      className={className}
      textAlign='left'
      {...rest}
    >
      {scrollable ? (
        <Scrollbars>
          {children}
        </Scrollbars>
      ) : children}
    </Dialog>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  scrollable: PropTypes.bool,
}

Modal.defaultProps = {
  label: '',
  className: '',
  scrollable: false,
  onSubmit: () => { },
}

Modal.Footer = Dialog.Footer
Modal.Button = Dialog.Button
Modal.displayName = 'Modal'

export default Modal
