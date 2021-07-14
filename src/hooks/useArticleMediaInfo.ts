import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from 'api'

export const useArticleMediaInfo = (lang: string, title: string, fromCommon: boolean) => {
  const [media, setMedia] = useState()

  useEffect(() => {
    const [promise, abort] = getArticleMediaInfo(lang, title, fromCommon)
    promise.then(setMedia)
    return abort
  }, [])

  return media
}
