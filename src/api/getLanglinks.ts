import {
  buildMwApiUrl, cachedFetch,
  isSupportedForReading, getDirection,
  isPrioritized
} from '../utils/index'

const getLangFromUrl = (url: string) => {
  // Get the lang code from the site URL since it may differ from
  // the official code used in configuration.
  const prefixLength = 'https://'.length
  return url.substr(prefixLength, url.indexOf('.') - prefixLength)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getLanglinks = (lang: string, title: string) => {
  const params = {
    action: 'query',
    titles: title,
    prop: 'langlinks',
    lllimit: 500,
    llprop: 'langname|autonym|url'
  }
  const url = buildMwApiUrl(lang, params)
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return cachedFetch(url, (response: any) => {
    const { pages } = response.query
    const langlinks = pages[0].langlinks
    const allLanguages = langlinks
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      .map((item: any) => {
        return {
          title: item.autonym,
          langname: item.langname,
          lang: getLangFromUrl(item.url),
          description: item.title,
          dir: getDirection(item.lang)
        }
      })
      .filter((item: any) => isSupportedForReading(item.lang))

    // Sort languages prioritized first, and then
    // in alphabetical order within the prioritized
    // and non-prioritized groups.
    allLanguages.sort((a: any, b: any) => {
      const aPrio = isPrioritized(a.lang)
      const bPrio = isPrioritized(b.lang)
      if (aPrio && !bPrio) {
        return 0
      } else if (!aPrio && bPrio) {
        return 1
      } else {
        if (a.lang < b.lang) {
          return -1
        } else if (a.lang > b.lang) {
          return 1
        }
        return 0
      }
    })

    return allLanguages
  })
}
