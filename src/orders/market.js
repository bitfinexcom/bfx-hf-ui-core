import _toUpper from 'lodash/toUpper'

export default (t = () => {}) => ({
  label: t('orderForm.marketTitle'),
  uiIcon: 'market-active',
  customHelp: t('orderForm.marketHelp'),

  generateOrder: (data = {}, symbol, context) => {
    const { reduceonly, amount, lev } = data
    const orderDefinition = {
      type: context === 'm' || context === 'f' ? 'MARKET' : 'EXCHANGE MARKET',
      amount,
      symbol,
      reduceonly,
    }

    if (context === 'f') {
      orderDefinition.lev = lev
    }

    return orderDefinition
  },

  header: {
    component: 'ui.checkbox_group',
    fields: ['reduceonly'],
  },

  sections: [{
    title: '',
    name: 'general',
    rows: [
      ['price', 'amount'],
    ],
  }, {
    title: '',
    name: 'lev',
    fullWidth: true,
    rows: [
      ['lev'],
    ],

    visible: {
      _context: { eq: 'f' },
    },
  }, {
    title: '',
    name: 'ticker',
    fullWidth: true,
    rows: [
      ['ticker'],
    ],
  }],

  fields: {
    reduceonly: {
      component: 'input.checkbox',
      label: t('orderForm.reduceOnlyCheckbox'),
      customHelp: t('orderForm.reduceOnlyMessage'),
      trading: ['m', 'f'],
      default: false,
    },

    price: {
      component: 'input.price',
      label: `${t('table.price')} $QUOTE`,
      disabled: true,
      default: _toUpper(t('orderForm.marketTitle')),
    },

    amount: {
      component: 'input.amount',
      label: `${t('table.amount')} $BASE`,
    },

    lev: {
      component: 'input.range',
      label: t('orderForm.laverage'),
      min: 1,
      max: 100,
      default: 10,
    },

    ticker: {
      component: 'ui.ticker',
    },
  },

  actions: ['buy', 'sell'],
})
