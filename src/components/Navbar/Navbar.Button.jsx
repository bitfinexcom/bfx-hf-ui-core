import React from 'react'
import PropTypes from 'prop-types'
import cx from 'clsx'

export default function NavbarButton({
  icon, alt, className, ...props
}) {
  const Icon = icon
  return (
    <button type='button' className={cx('hfui-exchangeinfobar__button', className)} {...props}>
      {typeof icon === 'string' ? (
        <i className={`icon-${icon}`} role='button' aria-label={alt} tabIndex={0} />
      ) : (
        <Icon role='button' aria-label={alt} tabIndex={0} />
      )}
    </button>
  )
}

NavbarButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
}

NavbarButton.defaultProps = {
  alt: '',
  className: '',
}
