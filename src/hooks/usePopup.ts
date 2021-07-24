import { useContext } from 'preact/hooks'
import { PopupContext } from '../contexts/index'

/* eslint-disable  @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePopup = (component: any, options: any = {}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { setPopupState } = useContext(PopupContext)

  const close = () => {
    setPopupState(oldState => {
      const newState = [...oldState]
      newState.pop()
      return newState
    })
  }

  const closeAll = () => {
    setPopupState([])
  }

  const show = props => {
    setPopupState(oldState => {
      let newState = [...oldState]
      const newPopup = {
        component,
        props: {
          ...props,
          close,
          closeAll
        },
        options,
        id: component.name
      }
      if (options.stack) {
        // prevent showing duplicate component
        if (!newState.find(state => state.id === newPopup.id)) {
          newState.push(newPopup)
        }
      } else {
        newState = [newPopup]
      }
      return newState
    })
  }
  return [show, close]
}
