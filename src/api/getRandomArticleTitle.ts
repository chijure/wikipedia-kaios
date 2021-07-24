import { buildPcsUrl, cachedFetch } from '../utils/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getRandomArticleTitle = (lang: string) => {
  const url = buildPcsUrl(lang, 'title', 'random')
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return cachedFetch(url, (data: any) => data.items[0].title, false)
}
