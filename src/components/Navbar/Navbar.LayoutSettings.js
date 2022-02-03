import React, {
  useRef, useEffect, memo, useCallback,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'clsx'
import _entries from 'lodash/entries'
import _map from 'lodash/map'
import _filter from 'lodash/filter'
import _get from 'lodash/get'

import OutsideClickHandler from 'react-outside-click-handler'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { selectLayout, deleteLayout, saveLayout } from '../../redux/actions/ui'
import { getLayouts, getLayoutID } from '../../redux/selectors/ui'

import { ReactComponent as LayoutIcon } from './layout-icon.svg'
import NavbarButton from './Navbar.Button'
import Routes from '../../constants/routes'
import useToggle from '../../hooks/useToggle'

import AddLayoutComponentModal from '../../modals/Layout/AddLayoutComponentModal'
import CreateNewLayoutModal from '../../modals/Layout/CreateNewLayoutModal'
import { makeShorterLongName } from '../../util/ui'

const MAX_ID_LENGTH = 30

const Item = ({
  /* eslint-disable react/prop-types */
  isLayout,
  isSelected,
  isDisabled,
  children,
  ...props
}) => (
  <div
    className={cx('hfui-navbar__layout-settings__item', {
      'is-layout': isLayout,
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    })}
    {...props}
  >
    {children}
  </div>
)

const LayoutSettings = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // eslint-disable-next-line no-unused-vars
  const [isLayoutMenuOpen, toggleLayoutMenu, _openLayoutMenu, closeLayoutMenu] = useToggle(false)
  const [isCreateNewLayoutModalOpen, toggleCreateNewLayoutModal] = useToggle(false)
  const [isAddComponentModalOpen, toggleAddComponentModal] = useToggle(false)

  const layouts = useSelector(getLayouts)
  const layoutID = useSelector(getLayoutID)
  const layoutIsDirty = useSelector(state => state.ui.layoutIsDirty)
  const layout = _get(layouts, layoutID, {})
  const { pathname } = useLocation()
  const menuRef = useRef()

  // eslint-disable-next-line no-shadow
  const selectableLayouts = _filter(_entries(layouts), ([, layout]) => layout.routePath === pathname)
    .sort((a, b) => a[1].savedAt - b[1].savedAt)

  const onSave = useCallback(() => {
    if (!layout.isDefault && layoutIsDirty) {
      dispatch(saveLayout())
    }
  }, [dispatch, layout.isDefault, layoutIsDirty])

  useEffect(() => {
    const menuEl = menuRef.current
    if (isLayoutMenuOpen && menuEl) {
      requestAnimationFrame(() => {
        const { x, width } = menuEl.getBoundingClientRect()

        // overflowing outside of the window
        if (x + width > document.body.clientWidth) {
          const overflowPixels = x + width - document.body.clientWidth
          const spacing = 12

          // adjust position
          menuEl.style.transform = `translateX(calc(-50% - ${overflowPixels + spacing}px))`
        } else if (x < 0) {
          menuEl.style.transform = `translateX(-50%) translateX(${Math.abs(x) + 20}px)`
        }
      })
    }
  }, [isLayoutMenuOpen])

  const handleLayoutIconClick = useCallback((e) => {
    e.stopPropagation()
    toggleLayoutMenu()
  }, [toggleLayoutMenu])

  // eslint-disable-next-line lodash/prefer-lodash-method
  if (![Routes.tradingTerminal.path, Routes.marketData.path]
    .includes(pathname)) {
    return null
  }

  return (
    <div className='hfui-navbar__layout-settings'>
      <OutsideClickHandler onOutsideClick={closeLayoutMenu}>
        <NavbarButton
          icon={LayoutIcon}
          alt={t('layoutSettings.title')}
          onClick={handleLayoutIconClick}
          className={isLayoutMenuOpen ? 'is-open' : undefined}
        />
        {isLayoutMenuOpen && (
          <div ref={menuRef} className='hfui-navbar__layout-settings__menu'>
            <div className='hfui-navbar__layout-settings__title'>
              {t('layoutSettings.title')}
            </div>
            <div className='hfui-navbar__layout-settings__menu-buttons' onClick={toggleLayoutMenu}>
              <Item onClick={toggleAddComponentModal}>
                {t('layoutSettings.addComponent')}
              </Item>
              <Item onClick={onSave} isDisabled={layout.isDefault || !layoutIsDirty}>
                {t('ui.save')}
              </Item>
              <Item onClick={toggleCreateNewLayoutModal}>
                {t('ui.saveAs')}
              </Item>
              <div className='hfui-navbar__layout-settings__separator' />
              {_map(selectableLayouts, ([id, layoutDef]) => (
                <Item
                  key={id}
                  isLayout
                  isSelected={id === layoutID}
                  onClick={() => dispatch(selectLayout(id, layoutDef?.routePath))}
                >
                  {makeShorterLongName(id, MAX_ID_LENGTH)}
                  {layoutDef.canDelete && (
                  <div className='hfui-navbar__layout-settings__delete'>
                    <i className='icon-clear' role='button' aria-label='Delete layout' tabIndex={0} onClick={() => dispatch(deleteLayout(id))} />
                  </div>
                  )}
                </Item>
              ))}
            </div>
          </div>
        )}
      </OutsideClickHandler>

      <CreateNewLayoutModal
        isOpen={isCreateNewLayoutModalOpen}
        onClose={toggleCreateNewLayoutModal}
      />
      <AddLayoutComponentModal
        isOpen={isAddComponentModalOpen}
        onClose={toggleAddComponentModal}
      />
    </div>
  )
}

export default memo(LayoutSettings)
