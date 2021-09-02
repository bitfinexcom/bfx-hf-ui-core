export const getTradingModes = (t) => [
  {
    target: '.hfui-navbar__layout-settings .hfui-exchangeinfobar__button',
    content: t('joyride.trading1'),
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
    target: '.hfui-navbar__layout-settings .hfui-exchangeinfobar__button',
    content: t('joyride.market'),
  },
]

export const getStrategyEditorModes = (t) => [
  {
    target: '.hfui-create-strategy__btn',
    content: t('joyride.strategyEditor1'),
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
  back: t('joyride.backBtn'),
  close: t('joyride.closeBtn'),
  last: t('joyride.lastBtn'),
  next: t('joyride.nextBtn'),
  open: t('joyride.openBtn'),
  skip: t('joyride.skipBtn'),
})
