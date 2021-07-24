import { FunctionalComponent, h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup, useOnlineStatus, useScroll } from '../hooks/index'
import { ListView, goToRandomArticle } from './index'
import { goto, articleHistory } from '../utils/index'

export const Tips: FunctionalComponent = () => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const listRef = useRef<HTMLElement>()
  const i18n = useI18n()
  const [, setNavigation, getCurrent] = useNavigation('Tips', containerRef, listRef, 'y')

  const [showReadPopup] = usePopup(ReadPopup, { mode: 'fullscreen' })
  const [showSearchPopup] = usePopup(SearchPopup, { mode: 'fullscreen' })
  const [showSwitchPopup] = usePopup(SwitchPopup, { mode: 'fullscreen' })
  const [showAboutWikipediaPopup] = usePopup(AboutPopup, { mode: 'fullscreen' })

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item: any = items[index]
    item.action()
  }

  const onReadPopupSelected = () => {
    showReadPopup({ onSearchPopupSelected })
  }

  const onSearchPopupSelected = () => {
    showSearchPopup({ onSwitchPopupSelected })
  }

  const onSwitchPopupSelected = () => {
    showSwitchPopup({ showAboutWikipediaPopup })
  }

  useSoftkey('Tips', {
    left: i18n('softkey-back'),
    onKeyLeft: () => history.back(),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: () => history.back()
  })

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('tips-read'), action: onReadPopupSelected },
    { title: i18n('tips-search'), action: onSearchPopupSelected },
    { title: i18n('tips-switch'), action: onSwitchPopupSelected },
    { title: i18n('tips-about'), action: showAboutWikipediaPopup }
  ]

  return (
    <div className='tips' ref={containerRef}>
      <ListView
        header={i18n('tips-header')}
        items={items}
        containerRef={listRef}
      />
    </div>
  )
}

const tip = (origi: string, content: any, close, onNext, onTry) => {
  const i18n = useI18n()
  const aboutTip = origin === 'AboutPopup'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isOnline = useOnlineStatus()
  const textRef = useRef<HTMLDivElement>(undefined)
  const [scrollDown, scrollUp] = useScroll(textRef, 10, 'y')

  const onTryHandler = () => {
    articleHistory.clear()
    if (origin === 'SearchPopup') {
      close()
      onTry()
    } else if (origin === 'SwitchPopup') {
      onTry(close, true)
    } else {
      onTry(close)
    }
  }

  useSoftkey(origin, {
    left: i18n('softkey-back'),
    onKeyLeft: close,
    center: !aboutTip && isOnline ? i18n('softkey-try') : '',
    onKeyCenter: !aboutTip && isOnline ? onTryHandler : null,
    right: !aboutTip ? i18n('softkey-next') : '',
    onKeyRight: !aboutTip ? () => {
      close()
      onNext()
    } : null,
    onKeyArrowUp: scrollUp,
    onKeyArrowDown: scrollDown,
    onKeyBackspace: close
  }, [isOnline])

  return (
    <div className={'tip'}>
      <div className='tip-media'>
        <div className={`${aboutTip ? 'tip-image' : 'tip-animation'}`} style={{ backgroundImage: `url(${content.image})` }} />
      </div>
      <div className={'tip-header'}>{i18n(content.header)}</div>
      <div className={'tip-text'} ref={textRef} dangerouslySetInnerHTML={{ __html: i18n(content.message) }} />
    </div>
  )
}

interface ReadPopupProps {
  close: any;
  onSearchPopupSelected: any;
}

const ReadPopup: FunctionalComponent<ReadPopupProps> = ({ close, onSearchPopupSelected }: ReadPopupProps) => {
  const content = {
    image: 'images/tip-read-animation.gif',
    header: 'tip-read-header',
    message: 'tip-read-message'
  }
  return tip('ReadPopup', content, close, onSearchPopupSelected, goToRandomArticle)
}

interface SearchPopupProps {
  close: any;
  onSwitchPopupSelected: any;
}

const SearchPopup: FunctionalComponent<SearchPopupProps> = ({ close, onSwitchPopupSelected }: SearchPopupProps) => {
  const content = {
    image: 'images/tip-search-animation.gif',
    header: 'tip-search-header',
    message: 'tip-search-message'
  }
  return tip('SearchPopup', content, close, onSwitchPopupSelected, goto.search)
}

interface SwitchPopupProps {
  close: any;
  showAboutWikipediaPopup: any;
}

const SwitchPopup: FunctionalComponent<SwitchPopupProps> = ({ close, showAboutWikipediaPopup }: SwitchPopupProps) => {
  const content = {
    image: 'images/tip-switch-animation.gif',
    header: 'tip-switch-header',
    message: 'tip-switch-message'
  }
  return tip('SwitchPopup', content, close, showAboutWikipediaPopup, goToRandomArticle)
}

interface AboutPopupProps {
  close: any;
}

const AboutPopup: FunctionalComponent<AboutPopupProps> = ({ close }: AboutPopupProps) => {
  const content = {
    image: 'images/onboarding-0.png',
    header: 'tip-about-header',
    message: 'tip-about-message'
  }
  return tip('AboutPopup', content, close, null, null)
}
