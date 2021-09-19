import { FunctionalComponent, h } from 'preact'
import { useRef } from 'preact/hooks'
import { ReferencePreview, Gallery } from './index'
import {
  useScroll, usePopup,
  useI18n, useSoftkey, useArticleLinksNavigation, ArticleModel
} from '../hooks/index'
import { confirmDialog } from '../utils/index'

interface ArticleSubpage {
  sectionIndex?: number;
  anchor: string;
}

interface QuickFactsProps {
  article: ArticleModel;
  goToArticleSubpage: (article: ArticleSubpage) => void;
  dir: 'ltr' | 'rtl';
  close: () => void;
  closeAll: () => void;
}

export const QuickFacts: FunctionalComponent<QuickFactsProps> = ({
  article,
  goToArticleSubpage,
  dir,
  close,
  closeAll
}: QuickFactsProps) => {
  const i18n = useI18n()
  const containerRef = useRef<HTMLDivElement>(undefined)
  const [scrollDown, scrollUp, scrollPosition] = useScroll(containerRef, 20, 'y')
  const [showReferencePreview] = usePopup(ReferencePreview, { stack: true })
  const [showGalleryPopup] = usePopup(Gallery, {
    mode: 'fullscreen',
    stack: true
  })
  const source = {
    galleryItems: article.media,
    articleTitle: article.title,
    namespace: article.namespace,
    id: article.id
  }
  useSoftkey('QuickFacts', {
    left: i18n('softkey-close'),
    onKeyLeft: closeAll,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyBackspace: close
  })

  const linkHandlers = {
    reference: ({ referenceId }) => {
      if (article.references[referenceId]) {
        showReferencePreview({
          reference: article.references[referenceId],
          lang: article.contentLang,
          dir
        })
      }
    },
    section: ({
      text,
      anchor
    }) => {
      // @todo styling to be confirmed with design
      confirmDialog({
        message: i18n('confirm-section', text),
        dir,
        onSubmit: () => goToArticleSubpage({ anchor })
      })
    },
    image: ({ fileName }) => {
      showGalleryPopup({
        items: article.media,
        startFileName: fileName,
        lang: article.contentLang,
        dir
      })
    }
  }

  useArticleLinksNavigation(
    'QuickFacts',
    article.contentLang,
    containerRef,
    linkHandlers,
    [scrollPosition],
    source
  )

  return (
    <div
      className='quickfacts'
      dir={dir}
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: article.infobox }}
    />
  )
}
