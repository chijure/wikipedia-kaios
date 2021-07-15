import {FunctionalComponent, h} from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation } from '../hooks/index'

export const ReferencePreview: FunctionalComponent = ({ reference, lang, dir, close }: any) => {
  const i18n = useI18n()
  const contentRef = useRef<HTMLDivElement>(undefined)
  useArticleLinksNavigation('ReferencePreview', lang, contentRef)
  useSoftkey('ReferencePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [])

  return (
    <div class='reference-preview' dir={dir} ref={contentRef}>
      <div class='ref-title'>{i18n('reference-title', reference.number)}</div>
      <div class='ref-content'>
        <bdi dangerouslySetInnerHTML={{ __html: reference.content }} />
      </div>
    </div>
  )
}
