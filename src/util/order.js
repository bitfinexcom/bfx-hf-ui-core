export const getAOContext = (rowData) => {
  return rowData?.args?._futures ? 'Derivative' : rowData?.args?._margin ? 'Margin' : 'Exchange'
}
