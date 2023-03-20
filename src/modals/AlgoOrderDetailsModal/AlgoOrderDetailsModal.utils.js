import {
  Iceberg,
  TWAP,
  AccumulateDistribute,
  PingPong,
  Bracket,
  Recurring,
} from 'bfx-hf-algo'

const convertIntervalToSeconds = (interval) => {
  return `${interval / 1000}s`
}

export const getOrderDetails = (rowData = {}, t, formatTime) => {
  const { args = {}, id } = rowData
  const amount = Math.abs(args.amount)
  const sliceAmount = args.sliceAmount ? Math.abs(args.sliceAmount) : null

  switch (id) {
    case TWAP.id:
      return [
        {
          label: t('algoOrderForm.interval'),
          value: convertIntervalToSeconds(args.sliceInterval),
        },
        { label: t('algoOrderForm.target'), value: args.priceCondition },
        { label: t('algoOrderForm.sliceAmount'), value: sliceAmount },
        {
          label: t('algoOrderForm.amount'),
          value: amount,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
      ]

    case PingPong.id: {
      const { orderCount, pingAmount: _pingAmount, pongAmount: _pongAmount } = args
      const pingAmount = Math.abs(_pingAmount)
      const pongAmount = Math.abs(_pongAmount)

      if (orderCount && orderCount > 1) {
        return [
          {
            label: t('algoOrderForm.pingpong.pingMinPrice'),
            value: args.pingMinPrice,
          },
          {
            label: t('algoOrderForm.pingpong.pingMaxPrice'),
            value: args.pingMaxPrice,
          },
          {
            label: t('algoOrderForm.pingpong.pingAmount'),
            value: pingAmount,
          },
          {
            label: t('algoOrderForm.pingpong.pongAmount'),
            value: pongAmount,
          },
          {
            label: t('algoOrderForm.action'),
            value: t(`algoOrderForm.${args.action}`),
          },
          {
            label: t('algoOrderForm.pingpong.pongDistance'),
            value: args.pongDistance,
          },
          { label: t('algoOrderForm.orderCount'), value: orderCount },
        ]
      }
      return [
        { label: t('algoOrderForm.pingpong.pingPrice'), value: args.pingPrice },
        { label: t('algoOrderForm.pingpong.pongPrice'), value: args.pongPrice },
        {
          label: t('algoOrderForm.pingpong.pingAmount'),
          value: pingAmount,
        },
        {
          label: t('algoOrderForm.pingpong.pongAmount'),
          value: pongAmount,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
        { label: t('algoOrderForm.orderCount'), value: args.orderCount },
      ]
    }

    case Iceberg.id:
      return [
        { label: t('algoOrderForm.price'), value: args.price },
        args.sliceAmountPerc === 0
          ? { label: t('algoOrderForm.sliceAmount'), value: sliceAmount }
          : {
            label: t('algoOrderForm.sliceAsPerc'),
            value: args.sliceAmountPerc,
          },
        {
          label: t('algoOrderForm.amount'),
          value: amount,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
      ]

    case AccumulateDistribute.id:
      return [
        {
          label: t('algoOrderForm.interval'),
          value: convertIntervalToSeconds(args.sliceInterval),
        },
        {
          label: t('algoOrderForm.amountDistortionPerc'),
          value: args.amountDistortion,
        },
        {
          label: t('algoOrderForm.intervalDistortion'),
          value: args.intervalDistortion,
        },
        { label: t('algoOrderForm.sliceAmount'), value: sliceAmount },
        {
          label: t('algoOrderForm.amount'),
          value: amount,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
      ]

    case Bracket.id: {
      const ocoAmount = Math.abs(args.ocoAmount)

      return [
        { label: t('algoOrderForm.ocoLimitPrice'), value: args.limitPrice },
        { label: t('algoOrderForm.ocoStopPrice'), value: args.stopPrice },
        {
          label: t('algoOrderForm.ocoAmount'),
          value: ocoAmount,
        },
        {
          label: t('algoOrderForm.ocoAction'),
          value: t(`algoOrderForm.${args.ocoAction}`),
        },
        { label: t('algoOrderForm.initialOrderPrice'), value: args.orderPrice },
        {
          label: t('algoOrderForm.amount'),
          value: amount,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
      ] }

    case Recurring.id:
      return [
        {
          label: t('algoOrderForm.amount'),
          value: `${amount} ${args.currency}`,
        },
        {
          label: t('algoOrderForm.action'),
          value: t(`algoOrderForm.${args.action}`),
        },
        {
          label: t('algoOrderForm.recurring.recurrence'),
          value: t(`algoOrderForm.recurring.${args.recurrence}`),
        },
        {
          label:
            args.startedAt < Date.now()
              ? t('algoOrderForm.recurring.startedAt')
              : t('algoOrderForm.recurring.willStart'),
          value: formatTime(args.startedAt),
        },
        {
          label: t('algoOrderForm.recurring.endedAt'),
          value: args.endedAt
            ? formatTime(args.endedAt)
            : t('algoOrderForm.recurring.endless'),
        },
      ]

    default:
      return []
  }
}
