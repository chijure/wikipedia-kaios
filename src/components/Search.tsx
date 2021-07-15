import {FunctionalComponent, h} from 'preact'
import {useRef, useEffect, useState} from 'preact/hooks'
import {ListView, OfflinePanel, Consent, SearchLoading, Feed} from './index'
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
import {getRandomArticleTitle} from '../api/index'

export const Search: FunctionalComponent = () => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const inputRef = useRef<HTMLInputElement>(undefined)
  const listRef = useRef()
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
    // @ts-ignore
    const {index} = getCurrent()
    if (index && isFeedExpanded) {
      setLastFeedIndex(index)
    }
  }

  const onKeyCenter = () => {
    if (allowUsage()) {
      // @ts-ignore
      const {index, key} = getCurrent()
      handleLastFeedIndex()
      if (index) {
        goto.article(lang, key)
      } else if (isRandomEnabled() && !inputText) {
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
      // @ts-ignore
      listRef.current.scrollTop = 0
      // @ts-ignore
      setNavigation(0)
    } else {
      onExitConfirmDialog()
    }
  }

  const onKeyArrowDown = () => {
    // @ts-ignore
    const index = getCurrent().index
    if (!isFeedExpanded && !searchResults && index === 0) {
      setIsFeedExpanded(true)
      // @ts-ignore
      navigateNext()
      // @ts-ignore
    } else if (isFeedExpanded && index + 1 > getAllElements().length - 1) {
      // @ts-ignore
      setNavigation(1)
    } else {
      // @ts-ignore
      navigateNext()
    }
  }

  const onKeyArrowUp = () => {
    // @ts-ignore
    const index = getCurrent().index
    if (isFeedExpanded && !searchResults && index === 1) {
      setIsFeedExpanded(false)
      setLastFeedIndex(null)
      // @ts-ignore
      navigatePrevious()
    } else if (!isFeedExpanded && !searchResults && index === 0) {
      // @ts-ignore
      setNavigation(0)
    } else {
      // @ts-ignore
      navigatePrevious()
    }
  }

  const onInput = ({target, isComposing}) => {
    setInputText(target.value)
    if (isOnline && !isComposing) {
      setQuery(target.value)
    }
  }

  const onExitConfirmDialog = () => {
    // @ts-ignore
    const isInputType = current.type === 'INPUT'
    if (isInputType) {
      // @ts-ignore
      setNavigation(-1)
    }
    confirmDialog({
      title: i18n('confirm-app-close-title'),
      message: i18n('confirm-app-close-message'),
      onDiscardText: i18n('softkey-cancel'),
      onDiscard: () => {
        if (isInputType) {
          // @ts-ignore
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
    // @ts-ignore
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    left: allowUsage() ? i18n('softkey-tips') : '',
    onKeyLeft: allowUsage() ? onKeyLeft : null,
    // @ts-ignore
    onKeyBackspace: !(inputText && current.type === 'INPUT') && onKeyBackSpace,
    onKeyArrowDown: !loading && onKeyArrowDown,
    onKeyArrowUp: !loading && onKeyArrowUp
    // @ts-ignore
  }, [current.type, inputText, isOnline, searchResults, loading])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    if (!consentGranted && isOnline) {
      // @ts-ignore
      showConsentPopup()
    } else {
      // @ts-ignore
      closeConsentPopup()
      // @ts-ignore
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
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{display: (hideW ? 'none' : 'block')}} alt="wikipedia logo"/>
      {showSearchBar &&
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={inputText} onInput={ (e: any) => onInput(e)}
             data-selectable="true" maxLength={255} />}
      {showResultsList && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef}
                                    empty={i18n('no-result-found')}/>}
      {showLoading && <SearchLoading/>}
      {showOfflinePanel && <OfflinePanel/>}
      {showFeed &&
      <Feed lang={lang} isExpanded={isFeedExpanded} setIsExpanded={setIsFeedExpanded} lastIndex={lastFeedIndex}
            setNavigation={setNavigation} containerRef={listRef}/>}
    </div>
  )
}

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
