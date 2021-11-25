const GA_CUST_ID = 'HF_GA_CUST_ID'

export function storeGACustomerId(custId) {
  localStorage.setItem(GA_CUST_ID, custId)
}

export function removeGACustomerId() {
  localStorage.removeItem(GA_CUST_ID)
}

export function getGACustomerId() {
  return localStorage.getItem(GA_CUST_ID)
}
