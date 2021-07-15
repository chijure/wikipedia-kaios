import {FunctionalComponent, h} from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from '../hooks/index'
import { ListView } from './index'
import { goto } from '../utils/index'

export const PrivacyTerms: FunctionalComponent<any> = ({ close }: any) => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const listRef = useRef()
  const i18n = useI18n()

  const onKeyCenter = () => {
    // @ts-ignore
    const { index } = getCurrent()
    const item = items[index]

    if (item.action) {
      item.action()
    }
  }

  useSoftkey('PrivacyTerms', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: close
  })

  const [, setNavigation, getCurrent] = useNavigation('PrivacyTerms', containerRef, listRef, 'y')

  useEffect(() => {
    // @ts-ignore
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('settings-privacy'), action: goto.privacyPolicy, link: true },
    { title: i18n('settings-term'), action: goto.termsOfUse, link: true }
  ]

  return (
    <div class='privacyterms' ref={containerRef}>
      <ListView
        header={i18n('privacy-terms-header')}
        items={items}
        containerRef={listRef}
      />
    </div>
  )
}
