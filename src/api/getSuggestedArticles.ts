import { buildMwApiUrl, cachedFetch } from '../utils/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSuggestedArticles = (lang: string, title: string) => {
  const params = {
    action: 'query',
    prop: 'pageimages|description',
    piprop: 'thumbnail',
    pithumbsize: 160,
    pilimit: 3,
    generator: 'search',
    gsrsearch: `morelike:${title}`,
    gsrnamespace: 0,
    gsrlimit: 3,
    gsrqiprofile: 'classic_noboostlinks',
    uselang: 'content'
  }

  const url = buildMwApiUrl(lang, params)
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return cachedFetch(url, (data: any) => data.query && data.query.pages)
}
