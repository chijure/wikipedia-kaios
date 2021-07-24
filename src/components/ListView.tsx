import { h } from 'preact'

/**
 * The containerRef is suggested to be used together with the hooks useNavigation
 * without the containerRef, the view won't scroll to the selected row
 */
export const ListView = ({ items = [], header, containerRef, empty }: any) => {
  return (
    <div className='listview'>
      { header && <div className='header'>{header}</div> }
      <div className='list' ref={containerRef}>
        {
          items.length ? items.map(item => (
            <div className='item' dir={item.dir} data-selectable data-title={item.title} data-selected-key={item.title} key={item.title}>
              <div className='info'>
                <bdi className='title' dangerouslySetInnerHTML={{ __html: item.displayTitle || item.title }} />
                { item.description && <bdi className={`description${item.imageUrl ? ' withImg' : ''}`} dangerouslySetInnerHTML={{ __html: item.description }} /> }
              </div>
              { item.imageUrl && <div className='img' style={{ backgroundImage: `url(${item.imageUrl})` }} /> }
              { item.link && <div className='link'><img src='images/link.svg' alt='link' /></div> }
            </div>
          )) : <div className='empty'>{empty}</div>
        }
      </div>
    </div>
  )
}
