import React from 'react'
import PropTypes from 'prop-types'

import { Dialog } from '@ufx-ui/core'
import useModalFocus from '../../hooks/useModalFocus'
import Scrollbars from '../Scrollbars'

import './style.css'

const Modal = ({
  label, isOpen, onClose, onSubmit, children, className, scrollable, ...rest
}) => {
  useModalFocus()

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
