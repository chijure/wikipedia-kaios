import { FunctionalComponent, h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation } from '../hooks/index'

interface Reference {
  number: number;
  content: string;
}

interface ReferencePreviewProps {
  reference: Reference;
  lang: string;
  dir: 'ltr' | 'rtl';
  close: () => void;
}

export const ReferencePreview: FunctionalComponent<ReferencePreviewProps> = ({
  reference,
  lang,
  dir,
  close
}: ReferencePreviewProps) => {
  const i18n = useI18n()
  const contentRef = useRef<HTMLDivElement>(undefined)
  useArticleLinksNavigation('ReferencePreview', lang, contentRef)
  useSoftkey('ReferencePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [])

  return (
    <div className='reference-preview' dir={dir} ref={contentRef}>
      <div className='ref-title'>{i18n('reference-title', reference.number)}</div>
      <div className='ref-content'>
        <bdi dangerouslySetInnerHTML={{ __html: reference.content }} />
      </div>
    </div>
  )
}
