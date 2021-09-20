import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from '../api/index'

interface ArticleMediaInfo {
  author: string;
  description: string;
  filePage: string;
  license: string;
  source: string;
}

export const useArticleMediaInfo = (lang: string, title: string, currentIndex: number): ArticleMediaInfo => {
  const [media, setMedia] = useState(undefined)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useEffect(() => {
    const [promise, abort] = getArticleMediaInfo(lang, title)
    if (promise instanceof Promise) {
      promise.then(setMedia)
      return abort
    }
  }, [currentIndex])

  return media
}
