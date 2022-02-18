import { EVENT_DATA_SEPARATOR } from './events'
import { CHART_URL } from '../../redux/config'

export const sendMessageToIframe = (iframe, event, payload) => iframe.contentWindow.postMessage(`${event}${EVENT_DATA_SEPARATOR}${JSON.stringify(payload)}`, CHART_URL)
