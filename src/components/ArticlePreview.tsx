import { FunctionalComponent, h } from 'preact'
import {
  useArticleSummary, useI18n, useSoftkey,
  useArticlePreviewTracking
} from '../hooks/index'
import { goto } from '../utils/goto'

interface ArticlePreviewProps {
  lang: string;
  title: string;
  source: string;
  dir: 'auto' | 'rtl' | 'ltr';
  close: () => void;
  closeAll: () => void;
}

export const ArticlePreview: FunctionalComponent<ArticlePreviewProps> = ({
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

  return summary ? (
    <div className='article-preview' dir={dir}>
      <div className='item'>
        <div className='preview-title' dangerouslySetInnerHTML={{ __html: summary.titles.display }} />
        {summary.imageUrl && <img className='img' src={summary.imageUrl} />}
      </div>
      <div className='preview-text' dangerouslySetInnerHTML={{ __html: summary.preview }} />
    </div>
  ) : <LoadingPreview title={title} dir={dir} />
}

interface LoadingPreviewProps {
  title: string;
  dir: 'auto' | 'rtl' | 'ltr';
}

const LoadingPreview: FunctionalComponent<LoadingPreviewProps> = ({ title, dir }: LoadingPreviewProps) => (
  <div className='article-preview loading' dir={dir}>
    <div className='item'>
      <div className='preview-title'>{title}</div>
      <div className='loading-block img' />
    </div>
    <div className='preview-text'>
      <div className='loading-block full' />
      <div className='loading-block full' />
      <div className='loading-block full' />
    </div>
  </div>
)
