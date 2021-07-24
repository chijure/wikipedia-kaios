import { FunctionalComponent, h } from 'preact'
import { useI18n } from '../hooks/index'
import { buildWpMobileWebUrl, canonicalizeTitle } from '../utils/index'

interface Thumbnail {
  source: string;
  width: number;
  height: number;
}

interface ArticleFooterItem {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  thumbnail: Thumbnail;
  description: string;
  descriptionsource: string;
}

interface ArticleFooterProps {
  lang: string;
  title: string;
  items: ArticleFooterItem[];
  dir: 'auto' | 'rtl' | 'ltr';
}

export const ArticleFooter: FunctionalComponent<ArticleFooterProps> = ({
  lang,
  title,
  items = [],
  dir
}: ArticleFooterProps) => {
  const contentI18n = useI18n(lang)
  const headerTitle = contentI18n('toc-footer')

  return (
    <div className='article-footer'>
      <div className='content'>
        <h2 className='footer-title' data-anchor={canonicalizeTitle(headerTitle)}>{headerTitle}</h2>
        <div className='list'>
          {items.map(item => {
            return (
              <a className='item' dir={dir} title={item.title} key={item.title}>
                <div className='info'>
                  <div className='article-title'>{item.title}</div>
                  <div className='description'>{item.description}</div>
                </div>
                {item.thumbnail && <div className='img'><img src={item.thumbnail.source} alt={item.title} /></div>}
              </a>
            )
          })}
        </div>
        <h2 className='img'>
          <img src='images/wikipedia-wordmark-en.png' height='18' width='116' alt='wikipedia-wordmark' />
        </h2>
        <p className='license' dangerouslySetInnerHTML={{ __html: contentI18n('content-license') }} />
        <p className='browser'>
          <a className='external' rel='mw:ExtLink' href={buildWpMobileWebUrl(lang, title)}>
            {contentI18n('view-in-browser')}
          </a>
        </p>
      </div>
    </div>
  )
}
