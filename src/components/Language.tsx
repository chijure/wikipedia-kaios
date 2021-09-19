import { FunctionalComponent, h } from 'preact'
import { useState, useRef, useEffect, useContext } from 'preact/hooks'
import { DirectionContext } from '../contexts/index'
import { useNavigation, useI18n, useSoftkey, usePopup, useSearchLanguage } from '../hooks/index'
import { RadioListView } from './index'
import { setAppLanguage, getAppLanguage, getDirection, goto } from '../utils/index'

export const Language: FunctionalComponent = () => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const listRef = useRef<HTMLDivElement>()
  const { setDirState } = useContext(DirectionContext)

  const i18n = useI18n()
  const [lang, setLang] = useState(getAppLanguage())
  const [items, query, setQuery] = useSearchLanguage(lang)
  const [showLanguagePopup] = usePopup(LanguagePopup)
  const [current, setNavigation, getCurrent] = useNavigation('Language', containerRef, listRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()

    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]

      setLang(item.lang)
      setAppLanguage(item.lang)
      setDirState(getDirection(item.lang))
      goto.back()
    }
  }

  useSoftkey('Language', {
    right: i18n('softkey-search'),
    onKeyRight: () => setNavigation(0),
    center: i18n('centerkey-select'),
    onKeyCenter,
    left: i18n('softkey-cancel'),
    onKeyLeft: () => goto.back(),
    onKeyBackspace: !(query && current.type === 'INPUT') && (() => goto.back())
  }, [lang, items, current.type])

  useEffect(() => {
    setNavigation(items.findIndex(item => item.isSelected) + 1)
    showLanguagePopup({ i18n })
  }, [])

  return <div className='language' ref={containerRef}>
    <input type='text' placeholder={i18n('search-language-placeholder')} value={query}
      onInput={e => setQuery(e.currentTarget.value)} data-selectable='true' />
    <RadioListView header={i18n('language-change')} items={items} containerRef={listRef}
      empty={i18n('no-result-found')} />
  </div>
}

interface LanguagePopupProps {
  close: () => void;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  i18n: any;
}

const LanguagePopup: FunctionalComponent<LanguagePopupProps> = ({
  close,
  i18n
}: LanguagePopupProps) => {
  useSoftkey('LanguageMessage', {
    center: i18n('softkey-ok'),
    onKeyCenter: close,
    onKeyBackspace: () => {
      close()
      goto.back()
    }
  }, [])

  return <div className='language-message'>
    <div className='header'>{i18n('language-setting')}</div>
    <p className='preview-text'>{i18n('language-setting-message')}</p>
  </div>
}
