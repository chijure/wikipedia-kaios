import { FunctionalComponent, h } from 'preact'
import { memo } from 'preact/compat'
import {
  useArticleSummary, useI18n, useSoftkey,
  useArticlePreviewTracking
} from '../hooks/index'
import { goto } from '../utils/goto'

interface ArticlePreviewLoadingProps {
  title: string;
  dir: 'auto' | 'ltr' | 'rtl';
}

export const ArticlePreviewLoading: FunctionalComponent<ArticlePreviewLoadingProps> = memo(({ title, dir }) => (
  <div className='article-preview loading' dir={dir}>
    <div className='item'>
      <div class='preview-title'>{title}</div>
      <div class='loading-block img' />
    </div>

    <div className='preview-text'>
      <div class='loading-block full' />
      <div class='loading-block full' />
      <div class='loading-block full' />
    </div>
  </div>
))

interface ArticlePreviewContentProps {
  dir: 'auto' | 'ltr' | 'rtl';
  titleHtml: string;
  imageUrl: string;
  previewHtml: string;
}

export const ArticlePreviewContent: FunctionalComponent<ArticlePreviewContentProps> = memo(({ dir, titleHtml, imageUrl, previewHtml }) => (
  <div className='article-preview' dir={dir}>
    <div className='item'>
      <div className='preview-title' dangerouslySetInnerHTML={{ __html: titleHtml }} />

      {imageUrl &&
        <img className='img' src={imageUrl} />
      }
    </div>

    <div className='preview-text' dangerouslySetInnerHTML={{ __html: previewHtml }} />
  </div>
))

interface ArticlePreviewProps {
  lang: string;
  title: string;
  source: string;
  dir: 'auto' | 'rtl' | 'ltr';
  close: () => void;
  closeAll: () => void;
}

export const ArticlePreview: FunctionalComponent<ArticlePreviewProps> = memo(({
  lang,
  title,
  source,
  dir,
  close,
  closeAll
}: ArticlePreviewProps) => {
  const i18n = useI18n()
  const summary = useArticleSummary(lang, title)

  const read = () => {
    const readTitle = summary ? summary.titles.canonical : title
    closeAll()
    goto.article(lang, readTitle, true)
  }
  useSoftkey('ArticlePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: i18n('softkey-read'),
    onKeyCenter: read,
    onKeyBackspace: close
  }, [summary])

  useArticlePreviewTracking(summary, source, lang)

  return summary
    ? (
      <ArticlePreviewContent
        dir={dir}
        titleHtml={summary.titles.canonical}
        imageUrl={summary.imageUrl}
        previewHtml={summary.previewHtml}
    />
      )
    : (
      <ArticlePreviewLoading
        title={title}
        dir={dir}
    />
      )
})
