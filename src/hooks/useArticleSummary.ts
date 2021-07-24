import { useState, useEffect } from 'preact/hooks'
import { getArticleSummary } from '../api/index'

export const useArticleSummary = (lang: string, title: string): unknown => {
  const [summary, setSummary] = useState(undefined)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    const [promise, abort] = getArticleSummary(lang, title)
    if (promise instanceof Promise) {
      promise.then(setSummary)
    }

    return abort
  }, [lang, title])

  return summary
}
