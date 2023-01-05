import {
  Iceberg,
  TWAP,
  AccumulateDistribute,
  PingPong,
  Bracket,
} from 'bfx-hf-algo'

const convertIntervalToSeconds = (interval) => {
  return `${interval / 1000}s`
}

export const getOrderDetails = (rowData = {}) => {
  const { args = {}, id } = rowData

  switch (id) {
    case TWAP.id:
      return [
        {
          label: 'Interval',
          value: convertIntervalToSeconds(args.sliceInterval),
        },
        { label: 'Slice', value: args.sliceAmount },
        { label: 'Target', value: args.priceCondition },
      ]

    case PingPong.id:
      return [
        { label: 'Ping Price', value: args.pingPrice },
        { label: 'Pong Price', value: args.pongPrice },
        { label: 'Order Count', value: args.orderCount },
      ]

    case Iceberg.id:
      return [
        args.sliceAmountPerc === 0
          ? { label: 'Slice', value: args.sliceAmount }
          : { label: 'Slice as %', value: args.sliceAmountPerc },
        { label: 'Price', value: args.price },
      ]

    case AccumulateDistribute.id:
      return [
        { label: 'Slice', value: args.sliceAmount },
        {
          label: 'Interval',
          value: convertIntervalToSeconds(args.sliceInterval),
        },
        { label: 'Amount Distortion %', value: args.amountDistortion },
        { label: 'Interval Distortion %', value: args.intervalDistortion },
      ]

    case Bracket.id:
      return [
        { label: 'Higher Bracket Price', value: args.limitPrice },
        { label: 'Lower Bracket Price', value: args.stopPrice },
        { label: 'Primary Order Price', value: args.orderPrice },
      ]

    default:
      return []
  }
}
