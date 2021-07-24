import { FunctionalComponent, h } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { ListView, OfflinePanel, Consent, SearchLoading, Feed } from './index'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup, useHistoryState,
  useExperimentConfig
} from '../hooks/index'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, confirmDialog, isConsentGranted,
  skipIntroAnchor
} from '../utils/index'
import { getRandomArticleTitle } from '../api/index'

export const Search: FunctionalComponent = () => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const inputRef = useRef<HTMLInputElement>(undefined)
  const listRef = useRef<HTMLElement>()
  const i18n = useI18n()
  const [isFeedExpanded, setIsFeedExpanded] = useState(false)
  const [lastFeedIndex, setLastFeedIndex] = useHistoryState('lastFeedIndex', null)
  const [current, setNavigation, getCurrent, getAllElements, navigateNext, navigatePrevious] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
  const isExperimentGroup = useExperimentConfig(lang)
  const [inputText, setInputText] = useHistoryState('search-input-text')
  const [setQuery, searchResults, loading] = useSearch(lang, inputText)
  const [showConsentPopup, closeConsentPopup] = usePopup(Consent)
  const consentGranted = isConsentGranted()
  const isOnline = useOnlineStatus(online => {
    if (online && inputRef.current) {
      setQuery(inputRef.current.value)
    }
  })

  const handleLastFeedIndex = () => {
    const { index } = getCurrent()
    if (index && isFeedExpanded) {
      setLastFeedIndex(String(index))
    }
  }

  const onKeyCenter = () => {
    if (allowUsage()) {
      const { index, key } = getCurrent()
      handleLastFeedIndex()
      if (index) {
        goto.article(lang, key)
      } else if (isRandomEnabled() && !inputText) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        goToRandomArticle()
      }
    }
  }

  const onKeyRight = () => {
    handleLastFeedIndex()
    goto.settings()
  }

  const onKeyLeft = () => {
    handleLastFeedIndex()
    goto.tips()
  }

  const onKeyBackSpace = () => {
    if (isFeedExpanded) {
      setIsFeedExpanded(false)
      setLastFeedIndex(null)
      listRef.current.scrollTop = 0
      setNavigation(0)
    } else {
      onExitConfirmDialog()
    }
  }

  const onKeyArrowDown = () => {
    const index = getCurrent().index
    if (!isFeedExpanded && !searchResults && index === 0) {
      setIsFeedExpanded(true)
      navigateNext()
    } else if (isFeedExpanded && index + 1 > getAllElements().length - 1) {
      setNavigation(1)
    } else {
      navigateNext()
    }
  }

  const onKeyArrowUp = () => {
    const index = getCurrent().index
    if (isFeedExpanded && !searchResults && index === 1) {
      setIsFeedExpanded(false)
      setLastFeedIndex(null)
      navigatePrevious()
    } else if (!isFeedExpanded && !searchResults && index === 0) {
      setNavigation(0)
    } else {
      navigatePrevious()
    }
  }

  const onInput = ({ target, isComposing }) => {
    setInputText(target.value)
    if (isOnline && !isComposing) {
      setQuery(target.value)
    }
  }

  const onExitConfirmDialog = () => {
    const isInputType = current.type === 'INPUT'
    if (isInputType) {
      setNavigation(-1)
    }
    confirmDialog({
      title: i18n('confirm-app-close-title'),
      message: i18n('confirm-app-close-message'),
      onDiscardText: i18n('softkey-cancel'),
      onDiscard: () => {
        if (isInputType) {
          setNavigation(0)
        }
      },
      onSubmitText: i18n('softkey-exit'),
      onSubmit: window.close
    })
  }

  const allowUsage = () => {
    return isOnline || consentGranted
  }

  useSoftkey('Search', {
    right: allowUsage() ? i18n('softkey-settings') : '',
    onKeyRight: allowUsage() ? onKeyRight : null,
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    left: allowUsage() ? i18n('softkey-tips') : '',
    onKeyLeft: allowUsage() ? onKeyLeft : null,
    onKeyBackspace: !(inputText && current.type === 'INPUT') && onKeyBackSpace,
    onKeyArrowDown: !loading && onKeyArrowDown,
    onKeyArrowUp: !loading && onKeyArrowUp
  }, [current.type, inputText, isOnline, searchResults, loading])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    if (!consentGranted && isOnline) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      showConsentPopup()
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      closeConsentPopup()
      setNavigation(0)
    }
  }, [consentGranted, isOnline])

  const hideW = searchResults || !isOnline || loading || (isFeedExpanded && isExperimentGroup)
  const showSearchBar = allowUsage()
  const showResultsList = isOnline && searchResults && !loading
  const showLoading = isOnline && loading
  const showOfflinePanel = !isOnline
  const showFeed = isOnline && !searchResults && !showLoading && !showOfflinePanel && isExperimentGroup

  return (
    <div className='search' ref={containerRef}>
      <img className='double-u' src='images/w.svg' style={{ display: (hideW ? 'none' : 'block') }} alt='wikipedia logo' />
      {showSearchBar &&
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={inputText} onInput={(e: any) => onInput(e)}
        data-selectable='true' maxLength={255} />}
      {showResultsList && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef}
        empty={i18n('no-result-found')} />}
      {showLoading && <SearchLoading />}
      {showOfflinePanel && <OfflinePanel />}
      {showFeed &&
      <Feed lang={lang} isExpanded={isFeedExpanded} setIsExpanded={setIsFeedExpanded} lastIndex={lastFeedIndex}
        setNavigation={setNavigation} containerRef={listRef} />}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const goToRandomArticle: FunctionalComponent<any> = (closePopup, skipIntro = false) => {
  const lang = getAppLanguage()
  const [promise] = getRandomArticleTitle(lang)

  if (promise instanceof Promise) {
    promise.then(title => {
      if (closePopup) {
        closePopup()
      }
      goto.article(lang, skipIntro ? [title, skipIntroAnchor] : title)
    })
  }
}
