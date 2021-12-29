export const getTradingModes = (t) => [
  {
    target: '.hfui-navbar__layout-settings .hfui-exchangeinfobar__button svg',
    content: t('joyride.trading1'),
    disableBeacon: true,
  },
  {
    target: '.icon-notifications',
    content: t('joyride.trading2'),
  },
  {
    target: '.hfui-orderform__panel',
    content: t('joyride.trading3'),
  },
  {
    target: '.hfui-statusbar__left',
    content: t('joyride.trading4'),
  },
]

export const getMarketModes = (t) => [
  {
    target: '.hfui-navbar__layout-settings .hfui-exchangeinfobar__button svg',
    content: t('joyride.market'),
    disableBeacon: true,
  },
]

export const getStrategyEditorModes = (t) => [
  {
    target: '.hfui-create-strategy__btn',
    content: t('joyride.strategyEditor1'),
    disableBeacon: true,
  },
  {
    target: '.hfui-open-strategy__btn',
    content: t('joyride.strategyEditor2'),
  },
  {
    target: '.hfui-markdown__wrapper',
    content: t('joyride.strategyEditor3'),
  },
]

export const getLocaleOptions = (t) => ({
  back: t('ui.backBtn'),
  close: t('ui.closeBtn'),
  last: t('ui.lastBtn'),
  next: t('ui.nextBtn'),
  open: t('ui.openDlgBtn'),
  skip: t('ui.skipBtn'),
})
