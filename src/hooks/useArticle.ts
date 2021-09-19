import { useState, useEffect } from 'preact/hooks'
import { useI18n } from './index'
import { getArticle, getArticleMediaList, getSuggestedArticles } from '../api/index'
import { canonicalizeTitle } from '../utils/index'

export interface SectionModel {
  title: string;
  anchor: string;
  description: string;
  content: string;
  preview: string;
  imageUrl?: boolean;
  isFooter?: boolean;
}

export interface TocModel {
  level: number;
  line: string;
  anchor: string;
  sectionIndex: number;
}

export interface ThumbnailModel {
  source: string;
  width: number;
  height: number;
}

export interface SuggestedArticleModel {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  thumbnail: ThumbnailModel;
  description: string;
  descriptionsource: string;
}

export interface GalleryModel {
  canonicalizedTitle: string;
  caption: string;
  fromCommon: boolean;
  title: string;
}

export interface ArticleModel {
  contentLang: string;
  namespace: number;
  id: number;
  infobox: string;
  sections: SectionModel[];
  toc: TocModel[];
  references: unknown;
  languageCount: number;
  dir: string;
  title: string;
  suggestedArticles: SuggestedArticleModel[];
  media: GalleryModel[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useArticle = (lang: string, title: string) => {
  const [article, setArticle] = useState(null)
  const contentI18n = useI18n(lang)
  const moreInformationText = contentI18n('more-information')

  let abortFunctions: { (): void; } [] = []

  const abortAll = () => {
    if (abortFunctions) {
      abortFunctions.forEach(f => f())
    }
  }

  const loadArticle = () => {
    setArticle(null)
    const [articlePromise, articleAbort] = getArticle(lang, title, moreInformationText)
    const [mediaPromise, mediaAbort] = getArticleMediaList(lang, title)
    const [suggestionsPromise, suggestionsAbort] = getSuggestedArticles(lang, title)
    abortFunctions = [articleAbort, mediaAbort, suggestionsAbort]

    Promise.all([articlePromise, mediaPromise, suggestionsPromise])
      .then(([article, media, suggestedArticles]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { sections, toc } = article
        const footerTitle = contentI18n('toc-footer')
        const anchor = canonicalizeTitle(footerTitle)

        // build footer used section and toc
        // with header title in the same language as article
        const sectionsWithFooter = sections.concat({
          title: footerTitle,
          anchor,
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: footerTitle, anchor, sectionIndex: sectionsWithFooter.length - 1 })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setArticle({ ...article, title, sections: sectionsWithFooter, toc: tocWithFooter, suggestedArticles, media })
      }, error => {
        setArticle({ error })
      })
  }

  useEffect(() => {
    loadArticle()
    return abortAll
  }, [lang, title])

  return [article, loadArticle]
}
