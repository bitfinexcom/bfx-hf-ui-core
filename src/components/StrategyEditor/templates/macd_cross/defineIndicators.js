export default `(I) => {
  const indicators = {
    macd: new I.MACD([10, 26, 9])
  }

  indicators.macd.color = '#00ff00'

  return indicators
}`
