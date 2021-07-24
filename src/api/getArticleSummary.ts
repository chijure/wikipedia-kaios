import { cachedFetch, buildPcsUrl } from '../utils/index'

export const getArticleSummary = (lang: string, title: string): [Promise<unknown>, (() => void)] => {
  const url = buildPcsUrl(lang, title, 'summary')

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return cachedFetch(url, (data: any) => ({
    titles: data.titles,
    imageUrl: data.thumbnail && data.thumbnail.source,
    preview: data.extract_html || data.description,
    namespace: data.namespace.id,
    id: data.pageid
  })
  )
}
