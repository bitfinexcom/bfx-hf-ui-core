const timeFrames = [
  '1m', '5m', '15m',
  '30m', '1h', '3h',
  '6h', '12h', '1D',
  '7D', '1M',
]

export const TIMEFRAME_INTERVAL_MAPPING = {
  [timeFrames[0]]: '1',
  [timeFrames[1]]: '5',
  [timeFrames[2]]: '15',
  [timeFrames[3]]: '30',
  [timeFrames[4]]: '60',
  [timeFrames[5]]: '180',
  [timeFrames[6]]: '360',
  [timeFrames[7]]: '720',
  [timeFrames[8]]: '1D',
  [timeFrames[9]]: '1W',
  [timeFrames[10]]: '1M',
}

export default timeFrames
