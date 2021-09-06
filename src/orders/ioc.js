export default (t) => ({
  label: t('orderForm.iocTitle'),
  customHelp: t('orderForm.iocHelp'),
  uiIcon: 'immediate-or-cancel-active',

  generateOrder: (data = {}, symbol, context) => {
    const {
      reduceonly, price, amount, lev,
    } = data

    const orderDefinition = {
      type: context === 'm' || context === 'f' ? 'IOC' : 'EXCHANGE IOC',
      price,
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
    },

    amount: {
      component: 'input.amount',
      label: `${t('table.amount')} $BASE`,
    },
    ticker: {
      component: 'ui.ticker',
    },

    lev: {
      component: 'input.range',
      label: t('orderForm.laverage'),
      min: 1,
      max: 100,
      default: 10,
    },
  },

  actions: ['buy', 'sell'],
})
