import { isValidDate } from '../util/date'

export default (t) => ({
  label: t('orderForm.stopLimitTitle'),
  uiIcon: 'stop-limit-active',
  customHelp: t('orderForm.stopLimitHelp'),
  id: 'stop limit',

  generateOrder: (data = {}, symbol, context) => {
    const {
      hidden, reduceonly, price, limitPrice, amount, tif, tifDate, lev, visibleOnHit,
    } = data

    if (tif && (!isValidDate(tifDate) || tifDate === 0)) {
      throw new Error('TIF date required')
    }

    const orderDefinition = {
      type: context === 'm' || context === 'f' ? 'STOP LIMIT' : 'EXCHANGE STOP LIMIT',
      priceAuxLimit: limitPrice,
      price,
      amount,
      symbol,
      hidden,
      reduceonly,
      visibleOnHit,
    }

    if (tif) {
      orderDefinition.tif = new Date(+tifDate).toISOString()
    }

    if (context === 'f') {
      orderDefinition.lev = lev
    }

    if (hidden && visibleOnHit) {
      orderDefinition.visibleOnHit = true
    } else {
      orderDefinition.visibleOnHit = false
    }

    return orderDefinition
  },

  header: {
    component: 'ui.checkbox_group',
    fields: ['hidden', 'reduceonly', 'tif', 'visibleOnHit'],
  },

  sections: [{
    title: '',
    name: 'general',
    rows: [
      ['price', 'amount'],
      ['limitPrice', null],
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

    hidden: {
      component: 'input.checkbox',
      label: t('orderForm.hiddenCheckbox'),
      customHelp: t('orderForm.hiddenMessage'),
      default: false,
    },

    visibleOnHit: {
      component: 'input.checkbox',
      label: t('orderForm.visibleOnHit'),
      customHelp: t('orderForm.visibleOnHitHelp'),
      default: false,
      visible: {
        hidden: { eq: true },
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

    limitPrice: {
      component: 'input.price',
      label: `${t('orderForm.limitPrice')} $QUOTE`,
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
