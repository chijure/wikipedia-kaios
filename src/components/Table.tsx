import { FunctionalComponent, h } from 'preact'
import { useRef } from 'preact/hooks'
import { memo } from 'preact/compat'
import { useI18n, useSoftkey, useScroll } from '../hooks/index'

interface TableProps {
  dir: 'ltr' | 'rtl';
  close: () => void;
  content: string;
}

export const Table: FunctionalComponent<TableProps> = memo(({
  dir,
  close,
  content
}: TableProps) => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const i18n = useI18n()
  const [scrollDown, scrollUp] = useScroll(containerRef, 20, 'y')
  const [scrollRight, scrollLeft] = useScroll(containerRef, 20, 'x')

  useSoftkey('Table', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyFixedArrowLeft: scrollLeft,
    onKeyFixedArrowRight: scrollRight
  })

  return (
    <div className='table' dir={dir} ref={containerRef}>
      <table dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
})
