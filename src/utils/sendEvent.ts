import { isProd } from './mode'

const intakeUrl = 'https://intake-analytics.wikimedia.org/v1/events' + (isProd() ? '?hasty=true' : '')

export const sendEvent = ($schema: string, stream:string, legacySchemaName: string, lang: string, event:unknown): void => {
  const body = JSON.stringify({
    $schema,
    schema: legacySchemaName,
    meta: { stream },
    client_dt: new Date().toISOString(),
    webHost: window.location.hostname,
    wiki: `${lang}wiki`,
    event
  })
  navigator.sendBeacon(intakeUrl, body)
}
