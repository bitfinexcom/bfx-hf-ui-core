const getBrowserFullscreenProp = () => {
  if (typeof document.fullscreenElement !== 'undefined') {
    return 'fullscreenElement'
  }

  if (typeof document.mozFullScreenElement !== 'undefined') {
    return 'mozFullScreenElement'
  }

  if (typeof document.msFullscreenElement !== 'undefined') {
    return 'msFullscreenElement'
  }

  if (typeof document.webkitFullscreenElement !== 'undefined') {
    return 'webkitFullscreenElement'
  }

  throw new Error('fullscreenElement is not supported by this browser')
}

export {
  getBrowserFullscreenProp,
}
