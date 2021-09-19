import { FunctionalComponent, h } from 'preact'
import { Ref, StateUpdater, useEffect, useState } from 'preact/hooks'
import { ListView } from './index'
import { useI18n } from '../hooks/index'
import { getTrendingArticles } from '../api/index'
import { getUserCountry } from '../utils/index'

interface FeedProps {
  lang: string;
  isExpanded: boolean;
  setIsExpanded: StateUpdater<boolean>;
  lastIndex: number;
  setNavigation: (index: number) => void;
  containerRef: Ref<HTMLDivElement>
}

export const Feed: FunctionalComponent<FeedProps> = ({ lang, isExpanded, setIsExpanded, lastIndex, setNavigation, containerRef }: FeedProps) => {
  const [trendingArticles, setTrendingArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const i18n = useI18n()
  const userCountry = getUserCountry()

  useEffect(() => {
    setLoading(true)
    const [request, abort] = getTrendingArticles(lang, userCountry)

    if (request instanceof Promise) {
      request.then(articles => {
        setLoading(false)
        setTrendingArticles(articles)
      })
      return abort
    }
  }, [lang, userCountry])

  useEffect(() => {
    if (lastIndex) {
      setIsExpanded(true)
      setNavigation(lastIndex)
    } else if (isExpanded) {
      setNavigation(1)
    }
  }, [trendingArticles, loading, isExpanded])

  const showArticles = trendingArticles.length > 0 && !loading
  const showError = trendingArticles.length === 0 && !loading

  return (
    <div className={`feed ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && <div className='cue' />}
      {loading && <Loading isExpanded={isExpanded} />}
      {showArticles && <ListView items={trendingArticles} header={i18n('feed-header')} containerRef={containerRef} />}
      {showError && <Error />}
    </div>
  )
}

interface LoadingProps {
  isExpanded: boolean;
}

const Loading: FunctionalComponent<LoadingProps> = ({ isExpanded }: LoadingProps) => {
  const i18n = useI18n()
  const loadingExpanded = () => {
    const loadingItem = (selectable = false) => {
      return (
        <div className='item' data-selectable={selectable}>
          <div className='bars'>
            <div className='bar' />
            <div className='smaller bar' />
          </div>
          <div className='rectangle' />
        </div>
      )
    }

    return (
      <div className='expanded'>
        <div className='top'>
          <div className='header'><span>{i18n('feed-header')}</span></div>
        </div>
        {loadingItem(true)}
        {loadingItem()}
        {loadingItem()}
      </div>
    )
  }

  return (
    <div className={`loading ${!isExpanded ? 'collapsed' : ''}`}>
      {isExpanded && loadingExpanded()}
    </div>
  )
}

const Error: FunctionalComponent = () => {
  const i18n = useI18n()
  return (
    <div className='error'>
      <img src='images/article-error.png' alt='article-error' />
      <p className='message' data-selectable>{i18n('feed-error-message')}</p>
    </div>
  )
}
