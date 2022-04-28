import { useEffect } from 'react'

const FOCUSABLE_ELEMENTS = ['input', 'button', '[role=button]']

const useModalFocus = (isOpen) => {
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
}

export default useModalFocus
