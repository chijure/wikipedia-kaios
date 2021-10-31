import { FunctionalComponent, h } from 'preact'
import { memo } from 'preact/compat'
import { Ref } from 'preact/hooks'
import { Languaje } from '@utils/languages'

interface RadioListViewProps {
  items: Languaje[];
  header: string;
  containerRef: Ref<HTMLDivElement>;
  empty: string;
}

export const RadioListView: FunctionalComponent<RadioListViewProps> = memo(({
  items = [],
  header,
  containerRef,
  empty
}: RadioListViewProps) => {
  return (
    <div className='radiolistview'>
      {header && <div className='header'>{header}</div>}
      <div className='list' ref={containerRef}>
        {
          items.length
            ? items.map(item => (
              <div className='item' dir={item.dir} data-selectable='true' data-title={item.title}
                data-selected-key={item.title} key={item.title}>
                <div className='info'>
                  <div className='title'>{item.title}</div>
                  {item.description && <div className='description'>{item.description}</div>}
                </div>
                <div className='radio-container'>
                  <div className={`radio ${item.isSelected ? 'selected' : ''}`} />
                </div>
              </div>
            ))
            : <div className='empty'>{empty}</div>
        }
      </div>
    </div>
  )
})
