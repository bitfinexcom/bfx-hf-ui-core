import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _some from 'lodash/some'
import cx from 'clsx'

import { Dialog } from '@ufx-ui/core'
import useModalFocus from '../../hooks/useModalFocus'
import Scrollbars from '../Scrollbars'
import ModalTabs from './Modal.Tabs'

import './style.css'

const Modal = ({
  label,
  isOpen,
  onClose,
  onSubmit,
  children,
  className,
  scrollable,
  ...rest
}) => {
  useModalFocus()

  const containsTabs = useMemo(
    () => _some(children, (el) => el === ModalTabs, false),
    [children],
  )

  return (
    <Dialog
      isOpen={isOpen}
      title={label}
      onClose={onClose}
      onSubmit={onSubmit}
      className={cx(className, { 'hfui-modal-tabs-wrapper': containsTabs })}
      textAlign='left'
      {...rest}
    >
      {scrollable ? <Scrollbars>{children}</Scrollbars> : children}
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
Modal.Tabs = ModalTabs
Modal.displayName = 'Modal'

export default Modal
