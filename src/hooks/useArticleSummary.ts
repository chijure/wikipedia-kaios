import { useState, useEffect } from 'preact/hooks'
import { getArticleSummary } from '../api/index'

export const useArticleSummary = (lang: string, title: string) => {
  const [summary, setSummary] = useState(undefined)

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
