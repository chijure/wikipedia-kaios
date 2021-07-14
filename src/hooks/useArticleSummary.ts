import { useState, useEffect } from 'preact/hooks'
import { getArticleSummary } from 'api'

export const useArticleSummary = (lang: string, title: string) => {
  const [summary, setSummary] = useState()

  useEffect(() => {
    const [promise, abort] = getArticleSummary(lang, title)
    promise.then(setSummary)
    return abort
  }, [lang, title])

  return summary
}
