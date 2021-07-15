import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from '../api/index'

export const useArticleMediaInfo = (lang: string, title: string, fromCommon: boolean) => {
  const [media, setMedia] = useState(undefined)

  // @ts-ignore
  useEffect(() => {
    const [promise, abort] = getArticleMediaInfo(lang, title, fromCommon)
    if (promise instanceof Promise) {
      promise.then(setMedia)
      return abort
    }
  }, [])

  return media
}
