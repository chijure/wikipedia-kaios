import { useState, useLayoutEffect } from 'preact/hooks'
import { useSoftkey, useRange } from '../hooks/index'
import { viewport, isAnchorIntroSkip } from '../utils/index'

/* eslint-disable  @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useArticlePagination = (elementRef: any, article: any, anchor: string): [number, ((newValue: number) => void), number] => {
  const [currentSection, showPrevSection, showNextSection, setCurrentSection] = useRange(findSection(article.toc, anchor), article.sections.length - 1)
  const [isLastPage, setIsLastPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  useSoftkey('Article', {
    onKeyArrowDown: () => {
      const previous = elementRef.current.scrollLeft
      elementRef.current.scrollLeft += viewport().width
      const after = elementRef.current.scrollLeft

      // show the next section of the article
      if (previous === after) {
        showNextSection()
      } else {
        setCurrentPage(p => p + 1)
      }
    },
    onKeyArrowUp: () => {
      const previous = elementRef.current.scrollLeft
      elementRef.current.scrollLeft -= viewport().width
      const after = elementRef.current.scrollLeft

      // show the previous section of the article
      if (previous === after) {
        showPrevSection()
        if (currentSection > 0) {
          setIsLastPage(1)
        }
      } else {
        setCurrentPage(p => p - 1)
      }
    }
  }, [currentSection])

  useLayoutEffect(() => {
    if (isLastPage) {
      const scrollWidth = elementRef.current.scrollWidth
      const offset = viewport().width
      elementRef.current.scrollLeft = scrollWidth - offset
      setCurrentPage(elementRef.current.scrollLeft / viewport().width)
      setIsLastPage(0)
    } else {
      elementRef.current.scrollLeft = 0
      setCurrentPage(0)
    }
  }, [currentSection])

  useLayoutEffect(() => {
    if (anchor) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const anchorElement: any = Array
        .from(elementRef.current.querySelectorAll('.title, h3, h4'))
        .find((e: any) => e.getAttribute('data-anchor') === anchor)

      if (anchorElement) {
        const offset = Math.floor(
          anchorElement.getBoundingClientRect().left / viewport().width
        )
        elementRef.current.scrollLeft += offset * viewport().width
        setCurrentPage(elementRef.current.scrollLeft / viewport().width)
      }
    }
  }, [anchor])

  useLayoutEffect(() => {
    if (isAnchorIntroSkip(anchor)) {
      elementRef.current.scrollLeft += viewport().width
      setCurrentPage(p => p + 1)
    }
  }, [])

  return [currentSection, setCurrentSection, currentPage]
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const findSection = (toc: any[], anchor: string): number => {
  if (!anchor || isAnchorIntroSkip(anchor)) {
    return 0
  }
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return toc.find((item: any) => item.anchor === anchor).sectionIndex
}
