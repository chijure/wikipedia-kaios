import { FunctionalComponent, h } from 'preact'

export const RadioListView: FunctionalComponent<any> = ({ items = [], header, containerRef, empty }: any) => {
  return (
    <div className='radiolistview'>
      { header && <div className='header'>{header}</div> }
      <div className='list' ref={containerRef}>
        {
          items.length ? items.map(item => (
            <div className='item' dir={item.dir} data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
              <div className='info'>
                <div className='title'>{item.title}</div>
                { item.description && <div className='description'>{item.description}</div> }
              </div>
              <div className='radio-container'>
                <div className={`radio ${item.isSelected ? 'selected' : ''}`} />
              </div>
            </div>
          )) : <div className='empty'>{empty}</div>
        }
      </div>
    </div>
  )
}
