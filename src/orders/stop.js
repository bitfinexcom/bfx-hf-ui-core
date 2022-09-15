import { isValidDate } from '../util/date'

export default (t) => ({
  label: t('orderForm.stopTitle'),
  uiIcon: 'stop-active',
  customHelp: t('orderForm.stopHelp'),
  id: 'stop',

  generateOrder: (data = {}, symbol, context) => {
    const {
      reduceonly, price, amount, tif, tifDate, lev,
    } = data

    if (tif && (!isValidDate(tifDate) || tifDate === 0)) {
      throw new Error('TIF date required')
    }

    const orderDefinition = {
      type: context === 'm' || context === 'f' ? 'STOP' : 'EXCHANGE STOP',
      price,
      amount,
      symbol,
      reduceonly,
    }

    if (tif) {
      orderDefinition.tif = new Date(+tifDate).toISOString()
    }

    if (context === 'f') {
      orderDefinition.lev = lev
    }

    return orderDefinition
  },

  header: {
    component: 'ui.checkbox_group',
    fields: ['reduceonly', 'tif'],
  },

  sections: [{
    title: '',
    name: 'general',
    rows: [
      ['price', 'amount'],
    ],
  }, {
    title: '',
    name: 'tif',
    fullWidth: true,
    rows: [
      ['tifDate'],
    ],

    visible: {
      tif: { eq: true },
    },
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
      visible: {
        _orderEditing: { neq: true },
      },
    },

    tif: {
      component: 'input.checkbox',
      label: t('orderForm.tifCheckbox'),
      customHelp: t('orderForm.tifMessage'),
      default: false,
      visible: {
        _orderEditing: { neq: true },
      },
    },

    price: {
      component: 'input.price',
      label: `${t('orderForm.stopPrice')} $QUOTE`,
    },

    amount: {
      component: 'input.amount',
      label: `${t('table.amount')} $BASE`,
    },

    tifDate: {
      component: 'input.date',
      label: t('orderForm.tifDate'),
      default: new Date(Date.now() + 86400000),
      minDate: new Date(),
    },

    lev: {
      component: 'input.range',
      label: t('orderForm.leverage'),
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
