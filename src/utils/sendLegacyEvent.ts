const BASE_URL = 'https://en.wikipedia.org/beacon/event'
const MAX_URL_LENGTH = 2000

const isUrlValid = (url: string) => url.length <= MAX_URL_LENGTH

interface eventBeacon {
  schema: string;
  revision: number;
  event: unknown;
  webHost: string;
  wiki: string;
}

const buildBeaconUrl = (event: eventBeacon) => {
  const queryString = encodeURIComponent(JSON.stringify(event))
  return `${BASE_URL}?${queryString}`
}

export const sendLegacyEvent = (schema: string, revision: number, language: string, event: unknown): void => {
  const url = buildBeaconUrl({
    schema,
    revision,
    event,
    webHost: `${language}.wikipedia.org`,
    wiki: `${language}wiki`
  })
  if (isUrlValid(url)) {
    navigator.sendBeacon(url)
  }
}
