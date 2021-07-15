import { buildMwOrgApiUrl, cachedFetch, sendErrorLog } from '../utils/index'

export const getTrendingArticles = (lang: string, country: string) => {
  const title = `Wikipedia_for_KaiOS/engagement1/trending/${lang}/${country.toLowerCase()}`
  const params = {
    action: 'query',
    prop: 'revisions',
    titles: title,
    rvslots: 'main',
    rvprop: 'content'
  }
  const url = buildMwOrgApiUrl(params)
  return cachedFetch(url, (data: any) => {
    const page = data.query.pages[0]
    if (page.missing) {
      sendErrorLog({ message: `There was an issue fetching '${page.title}', the full API response is: ${JSON.stringify(data)}`, url })
      return []
    }
    return JSON.parse(page.revisions[0].slots.main.content).slice(0, 5)
  })
}
