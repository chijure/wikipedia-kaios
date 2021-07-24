import { FunctionalComponent, h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from '../hooks/index'
import { ListView } from './index'

export const ArticleToc: FunctionalComponent = ({ items, currentAnchor, onSelectItem, close, closeAll }: any) => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const listRef = useRef<HTMLElement>()
  const i18n = useI18n()
  const listItems = parseTocItems(items)
  const [, setNavigation, getCurrent] = useNavigation('ArticleToc', containerRef, listRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = listItems[index]

    if (item && item.title) {
      onSelectItem(item)
      closeAll()
    }
  }
  useSoftkey('ArticleToc', {
    left: i18n('softkey-close'),
    onKeyLeft: () => closeAll(),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: () => close()
  })

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setNavigation(listItems.findIndex(item => item.anchor === currentAnchor))
  }, [])

  return <div className='toc' ref={containerRef}>
    <ListView header={i18n('header-sections')} items={listItems} containerRef={listRef} />
  </div>
}

const parseTocItems = items => {
  return items.map(item => {
    const anchor = item.anchor
    const sectionIndex = item.sectionIndex
    const displayTitle = item.level > 1 ? `<span class="subheader${item.level}">${item.line}</span>` : item.line
    return { anchor, title: anchor, sectionIndex, displayTitle }
  })
}
