import { useState, useEffect, useLayoutEffect } from 'preact/hooks'
import { getLanglinks } from '../api/index'

export interface LangLink {
  lang: string;
  url: string;
  langname: string;
  autonym: string;
  title: string;
  description: string;
  isSelected?: boolean;
}

export const useSearchArticleLanguage: (lang: string, title: string) =>
  [LangLink[], string, (value: string) => void, number] = (lang: string, title: string) => {
    const [items, setItems] = useState<LangLink[]>([])
    const [query, setQuery] = useState<string>('')
    const [allLanguages, setAllLanguages] = useState<LangLink[]>([])

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useEffect(() => {
      const [promise, abort] = getLanglinks(lang, title)
      if (promise instanceof Promise) {
        promise.then((languages: LangLink[]) => {
          setAllLanguages(languages)
          setItems(getInitialLangList(languages))
        })

        return abort
      }
    }, [])

    useLayoutEffect(() => {
      const filteredList = query ? filterFirst10Language(allLanguages, query) : getInitialLangList(allLanguages)
      setItems(filteredList.map((item: any) => {
        item.isSelected = item.lang === lang
        return item
      }))
    }, [query])

    useLayoutEffect(() => {
      setItems(items.map(item => {
        item.isSelected = item.lang === lang
        return item
      }))
    }, [lang])

    return [items, query, setQuery, allLanguages.length]
  }

const filterFirst10Language = (languages, text) => {
  const lowerCaseText = text.toLowerCase().trim()
  const foundList = []
  for (let i = 0; foundList.length < 10 && i < languages.length; i++) {
    if (
      languages[i].title.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].langname.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].description.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].lang.toLowerCase().indexOf(lowerCaseText) > -1
    ) {
      foundList.push(languages[i])
    }
  }
  return foundList
}

const getInitialLangList = (languages: LangLink[]) => {
  return languages.slice(0, 10)
}
