import { buildPcsUrl, cachedFetch } from 'utils'

export const getRandomArticleTitle = (lang: string) => {
  const url = buildPcsUrl(lang, 'title', 'random')

  return cachedFetch(url, (data: any) => data.items[0].title, false)
}
