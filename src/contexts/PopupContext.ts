import { createContext } from 'preact'
import { StateUpdater } from 'preact/hooks'

export interface PopupContextModel {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  popupState: any[];
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  setPopupState: StateUpdater<any[]>;
}

export const PopupContext = createContext<PopupContextModel>(undefined)
