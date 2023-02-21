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

export const getOrderDetails = (rowData = {}, t) => {
  const { args = {}, id } = rowData

  switch (id) {
    case TWAP.id:
      return [
        {
          label: t('algoOrderForm.interval'),
          value: convertIntervalToSeconds(args.sliceInterval),
        },
        { label: t('algoOrderForm.slice'), value: args.sliceAmount },
        { label: t('algoOrderForm.target'), value: args.priceCondition },
      ]

    case PingPong.id:
      return [
        { label: t('algoOrderForm.pingpong.pingPrice'), value: args.pingPrice },
        { label: t('algoOrderForm.pingpong.pongPrice'), value: args.pongPrice },
        { label: t('algoOrderForm.orderCount'), value: args.orderCount },
      ]

    case Iceberg.id:
      return [
        args.sliceAmountPerc === 0
          ? { label: t('algoOrderForm.slice'), value: args.sliceAmount }
          : {
            label: t('algoOrderForm.sliceAsPerc'),
            value: args.sliceAmountPerc,
          },
        { label: t('algoOrderForm.price'), value: args.price },
      ]

    case AccumulateDistribute.id:
      return [
        { label: t('algoOrderForm.slice'), value: args.sliceAmount },
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
      ]

    case Bracket.id:
      return [
        { label: t('algoOrderForm.ocoLimitPrice'), value: args.limitPrice },
        { label: t('algoOrderForm.ocoStopPrice'), value: args.stopPrice },
        { label: t('algoOrderForm.initialOrderPrice'), value: args.orderPrice },
      ]

    case Recurring.id:
      return [
        { label: t('algoOrderForm.amount'), value: args.amount },
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
          value: new Date(args.startedAt).toLocaleString(),
        },
        {
          label: t('algoOrderForm.recurring.endedAt'),
          value: args.endedAt
            ? new Date(args.endedAt).toLocaleString()
            : t('algoOrderForm.recurring.endless'),
        },
      ]

    default:
      return []
  }
}
