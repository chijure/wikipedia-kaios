import { FunctionalComponent, h } from 'preact'

export const Popup: FunctionalComponent = ({ component, props, options, style }: any) => {
  if (component) {
    let contentClasses = 'popup-content'
    if (options && options.mode === 'fullscreen') {
      contentClasses += ' fullscreen'
    }
    return (
      <div className={contentClasses} style={style}>
        { h(component, props) }
      </div>
    )
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const PopupContainer: FunctionalComponent<any> = ({ popups }: any) => {
  if (popups.length === 0) {
    return ''
  }
  let zIndex = 100
  const nextZIndex = () => {
    zIndex += 2
    return zIndex
  }
  // The shader is just before the last popup
  const shaderZIndex = 100 + popups.length * 2 - 1
  const lastIndex = popups.length - 1
  const hideOthers = popups[lastIndex].options.hideOthers
  return (
    <div className='popup'>
      <div className='shader' style={{ zIndex: shaderZIndex }} />
      { popups.map((popup, index) => {
        const style = {
          zIndex: nextZIndex(),
          visibility: (hideOthers && index < lastIndex) ? 'hidden' : 'visible'
        }
        return <Popup {...popup} key={popup.id} style={style} />
      }) }
    </div>
  )
}
